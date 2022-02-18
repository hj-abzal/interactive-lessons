// @ts-check
/* eslint-disable */

const {
    writeFileSync,
    createWriteStream,
    existsSync,
    promises: {mkdir, rm},
    constants,
    readFileSync,
} = require('fs');
const path = require('path');
const { execSync } = require("child_process");

/**
 * @type {{assetLink: string; path: string[]; link: string; id?: string; ext?: string, fsPath: string[]}[]}
 */
const dataPath = process.argv[process.argv.indexOf('--dataPath') + 1];

const data = JSON.parse(readFileSync(path.resolve(__dirname, dataPath)));

const images = data;//JSON.parse(data);
const tree = {};
images.forEach((imageInfo) => {
    imageInfo.fsPath.reduce((head, cur, i) => {
        if (i + 1 === imageInfo.fsPath.length) {
            // head[cur] = imageInfo;
            head[cur] = 'image_' + imageInfo.id.replace(':', '_');
            // head[cur].variableName = 'image_' + imageInfo.id.replace(':', '_');
            return;
        }
        if (!(cur in head)) {
            head[cur] = {};
        }
        return head[cur];
    }, tree);
});

Object.keys(tree.sberClassBioAssets).map((item) => {
    try {
        const filteredImages = images.filter((imageItem)=> imageItem.path[1] === item);
        execSync(
            `npx hygen generator post-images after --data '${JSON.stringify(tree.sberClassBioAssets[item])}' --destination '${item}' --images '${JSON.stringify(filteredImages)}'`,
            {
                cwd: process.cwd(),
            }
        );
    } catch (error) {
        writeFileSync('error.txt', String(error));
    }
});
