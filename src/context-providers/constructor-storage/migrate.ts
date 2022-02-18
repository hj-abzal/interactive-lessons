import {debugUtils} from '@/utils/debug-utils';
import {logger} from '@/utils/logger';
import {request} from '@/utils/http';
import {ScenarioStorageConfig, ScenarioStorageResponse} from '@/context-providers/constructor-storage/types';

export async function migrate(apiHost) {
    if (!debugUtils.isShouldMigrateConstructor()) {
        return;
    }

    logger.info('MIGRATIONS START');

    await newConstructorApiMigration(apiHost);

    logger.info('MIGRATIONS DONE');

    debugUtils.migrationDone();
}

async function newConstructorApiMigration(apiHost) {
    const version = 7;

    let passed = false;

    try {
        const check = await request(`${apiHost}/constructor/config`, {method: 'GET'});

        if (check && check.__version >= version) {
            passed = true;
        }
    } catch (e) {
        logger.info(e);
        if (!e.message.includes('404')) {
            passed = true;
        }
    }

    if (passed) {
        logger.info('newConstructorApiMigration skipped');
        return;
    }

    logger.info('newConstructorApiMigration start');

    const old = await request('https://auto.maging.studio/wf/v1/kv-store/get?name=constructor-config-13', {method: 'GET'});
    const data: ScenarioStorageResponse<any, any, any> = JSON.parse(old.data);

    logger.info('OLD CONF', data);

    const newConfig: ScenarioStorageConfig = {
        __version: version,
        packages: {},
        namespaces: data.namespaces,
        scenarios: data.scenarios,
    };

    logger.info('new conf', newConfig);

    await request(`${apiHost}/constructor/config/set`, {method: 'PUT', body: newConfig});

    for (const revision of Object.values(data.revisions)) {
        await (new Promise((resolve) => setTimeout(resolve, 500)));

        logger.info('UPD REVISION', revision);
        await request(`${apiHost}/constructor/revisions/${revision.id}/set`, {method: 'PUT', body: revision});
    }

    logger.info('newConstructorApiMigration done');
}
