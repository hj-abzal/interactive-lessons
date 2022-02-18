import InteractiveParallax, {LayerType} from '@/components/interactive-parallax';
import {LayerObjectType} from '@/components/interactive-parallax/layer-object';
import React, {useEffect, useState} from 'react';
import {useLesson} from './stages';
import {createObjects} from '../../steps/stranger-vision/objects';
import {layersDataSad, layersDataUnderwater} from '../../steps/stranger-vision/layers';
import {GolubVisionOverlay, HeronVisionOverlay} from '../../steps/stranger-vision/custom-layers';
import {ErrorMessageType, tasks, TasksType, visionDesc} from './tasks-data';
import {useChat} from '@/context-providers/chat';
import {getRandomItems} from '@/utils/get-random-items';

export const StrangerVisionFirstTrain = () => {
    const {setButtons} = useChat();
    const [trainTasks, setTrainTasks] = useState<TasksType[]>(() =>
        getRandomItems(tasks, 7).sort(() => Math.random() - 0.5)
    );

    const [currentTask, setCurrentTask] = useState<TasksType | undefined>(trainTasks[0]);
    const [trainErrors, setTrainErrors] = useState(0);
    const [passedTasks, setPassedTasks] = useState(0);
    const [choosenAnimal, setChoosenAnimal] = useState('');
    const [helper, setHelper] = useState(false);
    const [transform, setTransform] = useState('none');
    const [filter, setFilter] = useState('none');

    const onAnimalClick = (name: string) => {
        setChoosenAnimal(name);
        setHelper(true);
    };

    const [objects, setObjects] = useState(() => createObjects({onAnimalClick}));
    const [layersSad, setLayersSad] = useState(layersDataSad);
    const [layersUnderwater, setLayersUnderwater] = useState(layersDataUnderwater);
    const [isUnderWater, setIsUnderWater] = useState(false);
    const [isGolubVision, setIsGolubVision] = useState(false);
    const [isHeronVision, setIsHeronVision] = useState(false);
    const [shownScenes, setShownScenes] = useState(['sad']);
    const [errorMessage, setErrorMessage] = useState<ErrorMessageType>();
    const [choosenVision, setChoosenVision] = useState('');
    const [onBtnClick, setOnBtnClick] = useState('');
    const [buttonLabes, setButtonLabels] = useState<string[]>([]);

    const setObject = (objName, data: LayerObjectType) => {
        setObjects((oldObjects) => oldObjects.map((obj) => obj.name === objName ? {...obj, ...data} : obj));
    };

    const setTrainerObjects = (objName?: string) => {
        setObjects((oldObjects) => oldObjects.map((obj) => {
            const preparedName = obj.name?.replace(/[0-9]/g, '').trim();
            if (objName) {
                return preparedName === objName
                    ? {...obj, isHidden: false}
                    : {...obj, isHidden: true};
            }
            return visionDesc.includes(preparedName!)
                ? {...obj, isHidden: true}
                : {...obj};
        }));
    };

    const setTrainTask = () => {
        if (passedTasks < trainTasks.length - 2) {
            setCurrentTask(trainTasks[passedTasks + 1]);
        } else {
            setCurrentTask(undefined);
        }
    };

    const refreshTasks = () => {
        const newTasks = getRandomItems(tasks, 7).sort(() => Math.random() - 0.5);
        setTrainTasks(newTasks);
        setCurrentTask(newTasks[0]);

        setPassedTasks(0);
        setTrainErrors(0);
    };

    const setLayerSad = (layerIndex, data: LayerType) => {
        layersSad[layerIndex] = {...layersSad[layerIndex], ...data};
        setLayersSad(layersSad);
    };

    const removeShownScene = (sceneName) => {
        setShownScenes((oldScenes) => oldScenes.filter((scene) => scene !== sceneName));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setLayerUnderwater = (layerIndex, data: LayerType) => {
        layersUnderwater[layerIndex] = {...layersUnderwater[layerIndex], ...data};
        setLayersUnderwater(layersUnderwater);
    };

    const setShownScene = (sceneName) => {
        setShownScenes((oldScenes) => oldScenes.concat([sceneName]));
    };

    const isShowScene = (sceneName) => {
        return shownScenes.some((scene) => scene === sceneName);
    };

    const getButtonLabels = (currentTask: string) => {
        const arr = visionDesc.sort(() => Math.random() - 0.5)
            .filter((t) => t !== currentTask)
            .splice(0, 2)
            .concat(currentTask)
            .sort(() => Math.random() - 0.5);
        setButtonLabels(arr);
        return arr;
    };

    const setActionButtons = (tasks: string[]) => {
        setButtons([
            {
                label: tasks[0],
                onClick: () => setOnBtnClick(tasks[0]),
            },
            {
                label: tasks[1],
                onClick: () => setOnBtnClick(tasks[1]),
            },
            {
                label: tasks[2],
                onClick: () => setOnBtnClick(tasks[2]),
            }
        ]);
    };

    const setVisionTask = (currentTask: string) => {
        if (choosenVision !== currentTask) {
            setChoosenVision(currentTask);

            const tasks = getButtonLabels(currentTask);

            setActionButtons(tasks);
            setTrainerObjects(currentTask);
        } else {
            setActionButtons(buttonLabes);
        }
    };

    const {runStage} = useLesson({
        setTransform,
        setFilter,
        setObject,
        setLayerSad,
        setIsUnderWater,
        setIsGolubVision,
        setIsHeronVision,
        setShownScene,
        removeShownScene,
        setChoosenAnimal,
        currentTask,
        setTrainTask,
        refreshTasks,
        setVisionTask,
        setTrainerObjects,
        passedTasks,
        setPassedTasks,
        trainTasks,
        errorMessage,
        setTrainErrors,
        trainErrors,
    });

    const checkFirstTypeAnswer = () => {
        if (currentTask?.animal === choosenAnimal) {
            setHelper(false);
            runStage('taskSuccess');
        } else {
            setHelper(false);
            const animal = tasks.filter((t) => t.animal === choosenAnimal);

            setErrorMessage({
                animal: animal[0].inRussian,
                desc: animal[0].message,
            });

            runStage('taskError');
        }
    };

    const checkSecondTypeAnswer = () => {
        if (onBtnClick === choosenVision) {
            runStage('taskSuccess');
        } else {
            const animal = tasks.filter((t) => t.inRussian === onBtnClick);
            setErrorMessage({
                animal: '',
                desc: animal[0].message,
            });
            runStage('taskError');
        }
        setOnBtnClick('');
    };

    useEffect(() => {
        if (helper) {
            checkFirstTypeAnswer();
        }
    }, [onAnimalClick]);

    useEffect(() => {
        if (choosenVision.length > 0 && onBtnClick.length > 0) {
            checkSecondTypeAnswer();
            setButtons([]);
        }
    }, [onBtnClick]);

    useEffect(() => {
        runStage('start');
    }, []);

    return <div>
        <InteractiveParallax
            layersData={layersSad}
            objectsData={objects}
            sceneParams={{
                transform: isUnderWater ? 'scale(1.9) translate(20%, -40%)' : transform,
                filter: filter,
                parallaxFactor: 0.2,
                isHidden: !isShowScene('sad'),
            }}
        />

        <InteractiveParallax
            layersData={layersUnderwater}
            objectsData={objects}
            sceneParams={{
                transform: isUnderWater ? 'translate(0%, 0%) scale(1)' : 'translate(0%, 100%)',
                filter: filter,
                parallaxFactor: 0.2,
                isHidden: !isShowScene('prud'),
            }}
        />
        <GolubVisionOverlay active={isGolubVision} />
        <HeronVisionOverlay active={isHeronVision} />
    </div>;
};
