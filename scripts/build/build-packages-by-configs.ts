import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import process from 'process';
import {spawn} from 'child_process';
import _ from 'lodash';
import {logger} from '../logger';
import {
    SberPackage,
    ScenarioStorageConfig
} from '@/context-providers/constructor-storage/types';

const MAX_PARALLEL_TASKS = 5;
const ENABLE_REVISION_ASSETS_FILTER = false;
// Пути
const baseTemplatePath = buildPath('src/public/lesson-package-template.txt');
const constructorTemplatePath = buildPath('src/public/constructor-package-template.txt');

const constructorConfigPath = buildPath('src/codgen/constructor/config.json');
const allImagesPath = buildPath('./src/codgen/all-images.ts');
const packageImagesDir = buildPath('./src/codgen/temp-images/');

const webpackEntryTempDir = buildPath('src/temp-webpack/');
const distLessonsDir = buildPath('dist/lessons/');
const distPackagesDir = buildPath('dist/packages/');

const moduleGuidField = '__moduleGuid';

// Ключи шаблона
const baseTemplateKeys = {
    moduleName: '_MODULE_NAME_',
};

const constructorTemplateKeys = {
    namespaceSlug: '_NAMESPACE_SLUG_',
    scenarioSlug: '_SCENARIO_SLUG_',
};

async function main() {
    const basePackageTemplate = await fs.promises.readFile(baseTemplatePath).then((d) => d.toString());

    logger.info('PACKAGE_TEMPLATE', basePackageTemplate);

    const constructorPackageTemplate = await fs.promises.readFile(constructorTemplatePath).then((d) => d.toString());

    logger.info('PACKAGE_TEMPLATE', constructorPackageTemplate);

    const rawConstructorConfig = await fs.promises.readFile(constructorConfigPath).then((d) => d.toString());

    logger.info('CONSTRUCTOR_CONFIG', rawConstructorConfig);

    const constructorConfig: ScenarioStorageConfig = JSON.parse(rawConstructorConfig);

    const packages = Object.values(constructorConfig.packages);

    unlinkIfExist(distPackagesDir);
    unlinkIfExist(distLessonsDir);
    recreateIfExist(webpackEntryTempDir);
    recreateIfExist(packageImagesDir);

    try {
        // eslint-disable-next-line no-console
        console.time('build-time');

        await fs.promises.mkdir(distPackagesDir);

        const tasks = _.chunk(packages, MAX_PARALLEL_TASKS);

        for (const taskPackages of tasks) {
            const promises = taskPackages.map(async (pac) => {
                let packageData;

                if (pac.lessonPath) {
                    packageData = await getSimplePackageContent({template: basePackageTemplate, pac});
                } else if (pac.scenarioId && pac.namespaceId) {
                    packageData = await getConstructorPackageContent({
                        template: constructorPackageTemplate,
                        pac,
                        config: constructorConfig,
                    });
                } else {
                    throw new Error(`Cannot recognize strategy for ${JSON.stringify(pac)}`);
                }

                const {content, packageName, packageImagesConfigPath} = packageData;

                await buildPackage({packageName, content, packageImagesConfigPath});

                const moduleGuid = await prepareMeta({rawMeta: pac.meta, packageName});

                await zipPackage({packageName, moduleGuid});
            });

            await Promise.all(promises);
        }

        // eslint-disable-next-line no-console
        console.timeEnd('build-time');
    } catch (e) {
        logger.error(e);
        process.exit(1);
    }
}

function getSimplePackageContent({template, pac}: {template: string, pac: SberPackage}) {
    if (!pac.lessonPath) {
        throw new Error(`missing lessonPath ${pac.name}`);
    }

    const content = template
        .replace(
            new RegExp(baseTemplateKeys.moduleName, 'g'),
            pac.lessonPath
        );

    logger.debug('content', content);

    return {
        content,
        packageName: pac.lessonPath,
    };
}

async function getConstructorPackageContent({
    template,
    pac,
    config,
}: {
    template: string,
    pac: SberPackage,
    config: ScenarioStorageConfig
}) {
    const namespace = config?.namespaces[pac.namespaceId!];
    const scenario = config?.scenarios[pac.scenarioId!];

    if (!namespace || !scenario) {
        throw new Error(
            `
                missing ${!scenario && `scenario: ${pac.scenarioId}`} 
                ${!namespace && `namespace: ${pac.namespaceId}`} 
                ${pac.name}
            `
        );
    }

    const content = template
        .replace(
            new RegExp(constructorTemplateKeys.scenarioSlug, 'g'),
            scenario.slug
        )
        .replace(
            new RegExp(constructorTemplateKeys.namespaceSlug, 'g'),
            namespace.slug
        );

    logger.info('content', content);

    const packageName = `${namespace.slug}-${scenario.slug}`;

    const packageImagesConfigPath = await clearUnusedAssetsByRevision(
        {packageName,
            pac,
            config,
        });

    return {
        content,
        packageName,
        packageImagesConfigPath,
    };
}

async function clearUnusedAssetsByRevision({
    packageName,
    pac,
    config,
}: {
    packageName: string,
    pac: SberPackage,
    config: ScenarioStorageConfig
}) {
    if (!ENABLE_REVISION_ASSETS_FILTER) {
        logger.info(`CLEAR ASSETS SKIP FOR ${packageName}`);

        return undefined;
    }

    logger.info(`CLEAR ASSETS FOR ${packageName}`);

    const publishedRevisionId = config.scenarios[pac.scenarioId!].publishedRevisionId;

    const revisionPath = buildPath(`./src/codgen/constructor/revisions/${publishedRevisionId}.json`);
    const revisionContent = await fs.promises
        .readFile(revisionPath).then((data) => data.toString());

    const allImagesContent = await fs.promises
        .readFile(allImagesPath).then((data) => data.toString());

    const imgImportRe = new RegExp('import (?<name>[a-zA-Z]+) from', 'g');

    // @ts-ignore
    const imagesMatches = allImagesContent.matchAll(imgImportRe);

    const unusedImagesFolders: string[] = [];
    let match = imagesMatches.next();

    while (!match.done) {
        const imgName = match.value[1];

        if (!revisionContent.includes(imgName)) {
            unusedImagesFolders.push(imgName);
        }

        match = imagesMatches.next();
    }

    logger.debug('UNUSED IMAGES FOLDERS', unusedImagesFolders);

    const newImagesContent = allImagesContent.split('\n')
        .filter((line) =>
            !unusedImagesFolders.some((unusedImage) =>
                line.includes(`import ${unusedImage}`)
                || line.includes(`${unusedImage},`)
            )
        )
        .join('\n');

    logger.debug('NEW ALL IMAGES CONTENT', newImagesContent);

    const packageImagesConfigPath = path.resolve(packageImagesDir, `${Math.random()}.ts`);

    await fs.promises.writeFile(packageImagesConfigPath, newImagesContent);

    return packageImagesConfigPath;
}

async function buildPackage({
    packageName,
    content,
    packageImagesConfigPath,
}: {
    packageName: string,
    content: string,
    packageImagesConfigPath?: string
}) {
    const entryName = `${Math.random()}.tsx`;
    const webpackEntryPath = path.resolve(webpackEntryTempDir, entryName);

    logger.debug('NEW_TMP_CONTENT', content);

    await fs.promises.writeFile(webpackEntryPath, content);

    logger.info(`start building ${packageName}`);

    logger.debug(packageImagesConfigPath);

    await promisifySpawn(
        'webpack',
        ['--entry', webpackEntryPath, '-o', path.resolve(distLessonsDir, packageName)],
        {env: {IMAGES_CONFIG_PATH: packageImagesConfigPath}}
    );

    await fs.promises.rm(webpackEntryPath);
}

async function prepareMeta({rawMeta, packageName}: {rawMeta: string, packageName: string}) {
    logger.info('prepare meta');

    const metaContent = JSON.parse(rawMeta);

    logger.debug('META_CONTENT', metaContent);

    const moduleGuid = metaContent[moduleGuidField];

    // В итоговый json левое поле не надо класть
    delete metaContent[moduleGuidField];

    metaContent.task.taskVersion = String(metaContent.task.taskVersion);

    if (!moduleGuid) {
        throw new Error('moduleGuid is not specified');
    }

    const metaDistPath = path.resolve(distLessonsDir, packageName, `${moduleGuid}.json`);

    await fs.promises.writeFile(
        metaDistPath,
        JSON.stringify(metaContent, null, 4)
    );

    await fs.promises.chmod(metaDistPath, '777');

    return moduleGuid;
}

async function zipPackage({packageName, moduleGuid}) {
    logger.info(`start zipping ${packageName}, guid: ${moduleGuid}`);

    const tempArchiveDir = fs.mkdtempSync('./');

    try {
        logger.debug('CREATED_TEMP_DIR', tempArchiveDir);

        const src = path.resolve(distLessonsDir, packageName);
        const metaPath = path.resolve(distLessonsDir, packageName, `${moduleGuid}.json`);
        const tempDist = path.resolve(tempArchiveDir, `${moduleGuid}.zip`);
        const finalPath = path.resolve(distPackagesDir, `${packageName}.zip`);

        await promisifySpawn('zip', ['-j', '-r', tempDist, src, '-x', metaPath]);

        await promisifySpawn('zip', ['-j', finalPath, tempDist, metaPath]);

        unlinkIfExist(tempArchiveDir);
    } catch (err) {
        logger.error(err);

        unlinkIfExist(tempArchiveDir);

        throw err;
    }
}

// Хелперы
function buildPath(relativePath: string) {
    return path.resolve(process.cwd(), relativePath);
}

function promisifySpawn(command: string, args: string[], opts?: {env: any}) {
    return new Promise((resolve, reject) => {
        const builder = spawn(command, args, {env: {...process.env, ...opts?.env}});

        builder.stderr.pipe(process.stderr);
        builder.stdout.pipe(process.stdout);

        builder.stderr.on('data', reject);

        builder.on('error', reject);
        builder.on('close', resolve);
        builder.on('exit', resolve);
    });
}

function unlinkIfExist(url) {
    if (fs.existsSync(url)) {
        logger.info('unlink', url);
        rimraf.sync(url);
    }
}

async function recreateIfExist(url) {
    unlinkIfExist(url);
    await fs.promises.mkdir(url);
}

main();
