import {isProduction} from '@/utils/env';

const DEBUG_ENABLED_KEY = 'DEBUG_ENABLED';
const MIGRATE_KEY = 'MIGRATE_KEY';

export const initDebugUtils = () => {
    if (
        !isProduction
        && typeof window !== 'undefined'
        // @ts-ignore
        && !window.debugUtils
    ) {
        // @ts-ignore
        window.debugUtils = {
            enableDebugLogs() {
                localStorage.setItem(DEBUG_ENABLED_KEY, '1');
            },
            disableDebugLogs() {
                localStorage.setItem(DEBUG_ENABLED_KEY, '0');
            },
            migrateConstructor() {
                localStorage.setItem(MIGRATE_KEY, '1');
            },
        };
    }
};

export const debugUtils = {
    isDebugLogsEnabled: () => {
        if (isProduction) {
            return false;
        }

        return localStorage.getItem(DEBUG_ENABLED_KEY) === '1';
    },
    isShouldMigrateConstructor: () => {
        if (isProduction) {
            return false;
        }

        return localStorage.getItem(MIGRATE_KEY) === '1';
    },
    migrationDone: () => {
        localStorage.setItem(MIGRATE_KEY, '0');
    },
};
