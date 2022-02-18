import {useChat} from '@/context-providers/chat';
import {sleep, useStages} from '@/utils/use-stages';
import {TrainerType} from './tasks-data';
import {usePopup} from '@/context-providers/popup';
import {ResultPopup} from '@/lessons/bio-world-stranger-vision/scenarios/train-1/result-popup';
import {useSberclass} from '@/context-providers/sberclass';

export function useLesson({
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
    setTrainTask,
    refreshTasks,
    setVisionTask,
    setTrainerObjects,
    currentTask,
    setTrainErrors,
    trainErrors,
    passedTasks,
    setPassedTasks,
    trainTasks,
    errorMessage,
}) {
    const popupper = usePopup();
    const sberclass = useSberclass();
    const {typeMessage, clearMessages, setButtons} = useChat();
    const {stagesIds, runStage, currentStage, setStagesHistory} = useStages({
        async start() {
            clearMessages();
            setButtons([]);
            setLayerSad(0, {filter: false});
            setFilter('none');
            setTransform('scale(1.7) translate(-0%, -10%)');
            setObject('pchela', {
                isHidden: false,
                isUnclickable: true,
            });
            setObject('golub', {
                isHidden: false,
                isUnclickable: true,
            });
            setObject('kot', {
                isHidden: false,
                isUnclickable: true,
            });
            setObject('riba', {
                isHidden: false,
                isUnclickable: true,
            });
            setObject('tsvetokUltrafiolet', {
                isHidden: true,
            });
            setObject('tsvetok', {
                isHidden: false,
            });

            await typeMessage({
                delay: 2000,
                text: `
                Ты уже знаешь особенности зрения многих животных и наверняка с лёгкостью их опознаешь!
                Твоя задача в этом квесте — распознать, чьими глазами ты сейчас смотришь на окружающий мир.`,
            });

            await typeMessage({
                delay: 1000,
                text: 'Нажми Начать, чтобы приступить к квесту.',
            });

            setButtons([{
                label: 'Начать!',
                onClick: () => runStage('taskStart'),
            }]);
        },
        async taskStart() {
            const task = currentTask;

            if (task) {
                clearMessages();
                setButtons([]);
                await sleep(1000);
                setTransform(task.scene.transform);
                setIsGolubVision(task.scene.isGolubVision);
                setIsHeronVision(task.scene.isHeronVision);
                setIsUnderWater(task.scene.isUnderWater);
                setLayerSad(0, {filter: task.scene.layerSadFilter});
                setFilter(task.scene.filter);

                if (task.animal === 'riba'
                    || task.animal === 'глазами моллюска'
                    || task.animal === 'глазами креветки') {
                    setShownScene('prud');
                } else {
                    removeShownScene('prud');
                }

                if (task.type === TrainerType.Second) {
                    await typeMessage({
                        delay: 1000,
                        text: 'Выбери условия, в которых выгодны такие особенности зрения.',
                    });
                    setVisionTask(task.inRussian);
                } else {
                    setTrainerObjects();
                    await typeMessage({
                        delay: 1000,
                        text: 'Выбери животное, которое обладает такими особенностями зрения.',
                    });
                    setObject('golub', {
                        isHidden: false,
                        isUnclickable: false,
                        x: task.animal === 'golub' ? 33 : 45,
                    });
                    setObject('kot', {
                        isHidden: false,
                        isUnclickable: false,
                    });
                    setObject('pchela', {
                        isHidden: false,
                        isUnclickable: false,
                    });
                    setObject('riba', {
                        isHidden: false,
                        isUnclickable: false,
                    });
                    setObject('tsvetok', {
                        isHidden: task.animal === 'pchela',
                    });
                    setObject('tsvetokUltrafiolet', {
                        isHidden: task.animal !== 'pchela',
                        filter: 'sepia(1.6) brightness(1.68) hue-rotate(-185deg) contrast(0,16)',
                    });
                }
            } else {
                runStage('finish');
            }
        },
        async taskSuccess() {
            setPassedTasks((passed) => passed + 1);
            if (currentTask.type === TrainerType.Second) {
                await typeMessage({
                    delay: 1000,
                    text: `Верно! ${currentTask.message}.`,
                });
                await sleep(2000);
            } else {
                await typeMessage({
                    delay: 1000,
                    text: `Верно! ${currentTask.inRussian}.`,
                });
            }
            await sleep(1000);
            setButtons([{
                label: 'Далее',
                onClick: () => runStage('taskStart'),
            }]);
            setLayerSad(0, {filter: false});
            setFilter('none');
            setTransform('scale(1.7) translate(-0%, -10%)');
            setIsGolubVision(false);
            setIsHeronVision(false);

            if (currentTask.type === TrainerType.First && currentTask.animal === 'pchela') {
                setObject('tsvetokUltrafiolet', {
                    isHidden: true,
                });
                setObject('tsvetok', {
                    isHidden: false,
                });
            }

            setObject('golub', {
                isUnclickable: true,
                x: 45,
            });
            setObject('kot', {
                isUnclickable: true,
            });
            setObject('pchela', {
                isUnclickable: true,
            });
            setObject('riba', {
                isUnclickable: true,
            });
            setTrainTask();
            await sleep(1000);
        },
        taskError: async function () {
            setTrainErrors((errors) => errors + 1);
            clearMessages();
            setObject('golub', {
                isUnclickable: true,
            });
            setObject('kot', {
                isUnclickable: true,
            });
            setObject('pchela', {
                isUnclickable: true,
            });
            setObject('riba', {
                isUnclickable: true,
            });

            if (currentTask.type === TrainerType.Second) {
                await typeMessage({
                    delay: 1000,
                    text: `Нет, в таких условиях эти особенности не нужны. ${errorMessage.desc}.`,
                });
            } else {
                await typeMessage({
                    delay: 1000,
                    text: `Нет, это не ${errorMessage.animal}.`,
                });
                await typeMessage({
                    delay: 1000,
                    text: `${errorMessage.desc}`,
                });
                setChoosenAnimal('');
            }

            await sleep(1500);

            if (trainErrors >= 2) {
                setButtons([{
                    label: 'Далее',
                    onClick: () => {
                        sberclass.sendTaskResultRequest('FAILED');
                        popupper.addPopup({
                            id: 'result',
                            canClose: false,
                            content: <ResultPopup
                                errorsCount={trainErrors + 1}
                                isPassed={false}
                                passedTasks={passedTasks}
                                tasksCount={trainTasks.length}
                                onRetry={() => {
                                    refreshTasks();
                                    runStage('taskStart');
                                    popupper.hidePopup('result');
                                }}
                            />,
                        });
                    },
                }]);
            } else {
                setButtons([{
                    label: 'Ещё раз',
                    onClick: () => runStage('taskStart'),
                }]);
            }
        },
        async finish() {
            clearMessages();
            setButtons([]);
            setStagesHistory([]);
            setIsUnderWater(false);
            setTransform('scale(1.7) translate(-0%, -10%)');

            sberclass.sendTaskResultRequest('ACCEPTED');

            popupper.addPopup({
                id: 'result',
                canClose: false,
                content: <ResultPopup
                    errorsCount={trainErrors}
                    isPassed={true}
                    tasksCount={trainTasks.length}
                    passedTasks={passedTasks + 1}
                    onRetry={() => {
                        refreshTasks();
                        runStage('taskStart');
                        popupper.hidePopup('result');
                    }}
                />,
            });
        },
    });

    return {stagesIds, runStage, currentStage};
}
