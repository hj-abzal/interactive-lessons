import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';

export const sberclassScriptModule: ScriptModule = {
    id: 'sberclass',
    name: 'Сберкласс API',
    icon: 'Play',
    color: '#00aa00',
    hook: useSberclassScripts,
};

function useSberclassScripts() {
    const sendTaskResult = scriptBlock({
        title: 'Сохранить результат задания',
        func: ({status}, {sberclass}) => {
            const sberStatus = status === 'Пройдено' ? 'ACCEPTED' : 'FAILED';

            sberclass.sendTaskResultRequest(sberStatus);
        },
        inputs: {
            status: {
                label: 'Статус',
                type: InputTypeType.select,
                options: ['Пройдено', 'Провалено'],
                defaultValue: 'Пройдено',
            },
        },
    });

    return {
        blocks: {
            sendTaskResult,
        },
    };
}
