import {useEffect, useState} from 'react';
import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';

export const timerScriptModule: ScriptModule = {
    id: 'timer',
    name: 'Таймер',
    icon: 'TimerProvider',
    color: '#F2924C',
    hook: useTimerScripts,
};

function useTimerScripts() {
    const [timers, setTimers] = useState<any>([]);

    useEffect(() => {
        return () => {
            timers.forEach(clearTimeout);
        };
    }, [timers]);

    const sleepBlock = scriptBlock({
        title: 'Пауза',
        func: async (inputs) => {
            await new Promise<void>((resolve) => {
                const timerId = setTimeout(resolve, inputs.delay);
                setTimers((old) => old.concat(timerId));
            });
        },
        inputs: {
            delay: {
                label: 'Время паузы',
                type: InputTypeType.number,
                defaultValue: 1000,
            },
        },
    });

    return {
        blocks: {
            sleepBlock,
        },
    };
}
