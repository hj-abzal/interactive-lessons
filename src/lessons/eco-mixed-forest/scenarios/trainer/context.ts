import {createContextProvider} from '@/utils/create-safe-context';
import {EducationTask, RelationType} from '@/lessons/eco-mixed-forest/context/types';
import {tasksConfig} from '@/lessons/eco-mixed-forest/context/tasks-config';
import {useState} from 'react';
import {getRandomItems} from '@/utils/get-random-items';
import {logger} from '@/utils/logger';

export type TrainerContextType = {
    tasks: EducationTask[],
    currentTask: EducationTask,
    startNextTask: () => void,
    errorsCount: number,
    addError: () => void,
    currentTaskInd: number,
    passedCount: number,
    addPassedCount: () => void,
    withOnboarding: boolean,
    reset: () => void,
    setWithOnboarding: (val: boolean) => void,
}

const getRandomTasks = () => {
    const allTasks = tasksConfig.trainerTasks;

    return getRandomItems(allTasks, 7, (acc, item) => {
        // Стараемся выбрать уникальные типы
        if (acc.some((t) => t.relationType === item.relationType && acc.length < 6)) {
            return false;
        }

        // Не должны попадаться вместе
        if (
            item.relationType === RelationType.PredatorPrey
            && acc.some((t) => t.relationType === RelationType.ParasiteOwner)
        ) {
            return false;
        }

        // Не должны попадаться вместе
        if (
            item.relationType === RelationType.ParasiteOwner
            && acc.some((t) => t.relationType === RelationType.PredatorPrey)
        ) {
            return false;
        }

        // Не должны попадаться вместе
        if (
            item.relationType === RelationType.Mutualism
            && acc.some((t) => t.relationType === RelationType.Protocooperation)
        ) {
            return false;
        }

        // Не должны попадаться вместе
        if (
            item.relationType === RelationType.Protocooperation
            && acc.some((t) => t.relationType === RelationType.Mutualism)
        ) {
            return false;
        }

        return true;
    });
};

export const [
    TrainerContext,
    TrainerProvider,
    useTrainer
] = createContextProvider<TrainerContextType, any>(
    'TrainerContext',
    () => {
        const [withOnboarding, setWithOnboarding] = useState(true);
        const [tasks, setTasks] = useState(getRandomTasks);
        const [currentTaskInd, setCurrentTaskInd] = useState(0);
        const [errorsCount, setErrorsCount] = useState(0);
        const [passedCount, setPassetCount] = useState(0);

        logger.debug('tasks', tasks);

        const startNextTask = () => {
            if ((currentTaskInd) < tasks.length - 1) {
                setCurrentTaskInd((old) => old + 1);
            } else {
                return 'done';
            }
        };

        const addPassedCount = () => {
            setPassetCount((count) => count + 1);
        };

        const currentTask = tasks[currentTaskInd];

        const reset = () => {
            setTasks(getRandomTasks());
            setCurrentTaskInd(0);
            setErrorsCount(0);
            setPassetCount(0);
        };

        const state = {
            tasks,
            startNextTask,
            passedCount,
            addPassedCount,
            errorsCount,
            currentTask,
            currentTaskInd,
            addError: () => setErrorsCount((old) => old + 1),
            withOnboarding,
            setWithOnboarding,
            reset,
        };

        logger.debug('TRAINER_STATE', state);

        return state;
    });
