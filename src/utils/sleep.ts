import {useEffect, useState} from 'react';

export const useSleep = () => {
    // @ts-ignore
    const [timers, setTimers] = useState<any>([]);

    const sleep = (delay: number) => new Promise<void>((resolve) => {
        const timerId = setTimeout(() => {
            resolve();
        }, delay);

        setTimers((old) => old.concat(timerId));

        return timerId;
    });

    useEffect(() => {
        return () => {
            timers.forEach(clearTimeout);
        };
    }, [timers]);

    return sleep;
};

export type TimerReturnType = {
    sleep: (delay: number) => void;
}

export const useTimer = (): TimerReturnType => {
    const [timers, setTimers] = useState<any>([]);

    const sleep = async (delay: number) => {
        await new Promise<void>((resolve) => {
            const timerId = setTimeout(resolve, delay);
            setTimers((old) => old.concat(timerId));
        });
    };

    useEffect(() => {
        return () => {
            timers.forEach(clearTimeout);
        };
    }, [timers]);

    return {sleep};
};
