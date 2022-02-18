import {ScriptBlockFull, ScriptTask} from '@/components/constructor/script-blocks/types';
import _ from 'lodash';
import {ControlLogicState} from '@/components/constructor/script-blocks/control-logic';

export function resolveScriptBlockValuesWithParams({
    fullScript,
    scriptTask,
    stagesParams,
    tables,
}: {
    fullScript: ScriptBlockFull,
    scriptTask: ScriptTask,
    stagesParams: ControlLogicState['stagesParams'],
    tables: ControlLogicState['tables'],
}) {
    if (!fullScript.data.boundStageParams || !scriptTask.stageParams) {
        return fullScript.data.inputValues;
    }

    // Копируем, чтобы модифицировать
    const inputValues = JSON.parse(JSON.stringify(fullScript.data.inputValues));

    if (fullScript.data.boundStageParams && scriptTask.stageParams) {
        Object.keys(fullScript.data.boundStageParams).forEach((inputName) => {
            const boundParamData = fullScript.data.boundStageParams[inputName];

            if (!boundParamData) {
                return;
            }

            const boundParamConfig = stagesParams?.[scriptTask.stageId]
                ?.params[boundParamData.stageParamId];

            let paramValue = scriptTask.stageParams[boundParamData.stageParamId];

            // Для табличных папаметров
            if (
                boundParamConfig?.tableIdRef
                && boundParamData?.tableItemPath
                && tables?.[boundParamConfig.tableIdRef]
            ) {
                const tableItem = tables[boundParamConfig.tableIdRef]?.items
                    ?.find((item) => item.id === paramValue);

                const tableItemValue = _.get(tableItem || {}, boundParamData.tableItemPath.split('.'));

                paramValue = tableItemValue;
            }

            if (paramValue) {
                inputValues[inputName] = paramValue;
            }
        });
    }

    return inputValues;
}
