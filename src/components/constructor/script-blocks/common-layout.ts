import CommonLayout from '@/components/common-layout';
import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';

export const commonLayoutScriptModule: ScriptModule = {
    id: 'commonLayout',
    name: 'Общие элементы',
    icon: 'ComponentsProvider',
    color: '#F2924C',
    initialState: {
        title: null,
    },
    Component: CommonLayout,
    hook: useCommonLayoutScripts,
};

function useCommonLayoutScripts() {
    const setCommonLayoutTitleBlock = scriptBlock({
        title: 'Установить заголовок урока',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.title = inputs.title;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            title: {
                label: 'Заголовок',
                type: InputTypeType.textarea,
            },
        },
    });

    return {
        blocks: {
            setCommonLayoutTitleBlock,
        },
    };
}
