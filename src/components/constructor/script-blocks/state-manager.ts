import _ from 'lodash';
import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';

export const stateManagerScriptModule: ScriptModule = {
    id: 'stateManager',
    name: 'Состояние',
    icon: 'ObjectProvider',
    color: '#666666',
    hook: useStateManagerScripts,
};

function useStateManagerScripts() {
    const modifyDataBlock = scriptBlock({
        title: 'Изменить данные состояния',
        func: ({path, value}, {produceGlobalState}) => {
            produceGlobalState((draft) => {
                _.set(draft, path, value);
            });
        },
        inputs: {
            path: {
                label: 'Входные данные',
                type: InputTypeType.path,
                defaultValue: 'path.kek',
                searchable: 'root',
                isRequired: true,
            },
            value: {
                label: 'Новое значение',
                type: InputTypeType.auto,
                defaultValue: 'testValKek',
                dataInputId: 'valuePath',
                isRequired: true,
            },
        },
    });

    return {
        blocks: {
            modifyDataBlock,
        },
    };
}
