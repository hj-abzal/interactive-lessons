import {RunStageParams} from '@/components/constructor/side-bar/script-block/widget/index';

export const extractStageParams = (params: RunStageParams) => {
    if (typeof params === 'string') {
        return {
            stageId: params,
        };
    }

    return {
        stageId: params.stageId,
        params: params.params,
    };
};
