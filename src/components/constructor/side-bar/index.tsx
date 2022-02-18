import React, {useEffect} from 'react';
import {ConstructorScenarioState, useConstructorScenario} from '@/context-providers/constructor-scenario';
import {Clickable} from '@/components/clickable';
import {DataEditor, DataEditorProps} from '@/components/data-editor';
import classNames from 'classnames';
import {SideBarWrapper} from './css';
import {ConstructorScenarioSchema} from '@/components/constructor/types';
import {StateProducer} from '@/utils/use-immer-state';
import {useLocationSearchParams} from '@/utils/use-location-query';
import {ScriptBlockData} from '@/components/constructor/script-blocks/types';
import {useConstructorStorage} from '@/context-providers/constructor-storage';
import {TabsEnum} from '@/components/constructor/side-bar/types';
import {ScenesEditor} from './scenes-editor';
import {StagesEditor} from '@/components/constructor/side-bar/stages-editor';

export type Props = {
    state: ConstructorScenarioSchema,
    produceState: StateProducer<ConstructorScenarioSchema>
}

export type SideBarProps = {
    runStage: (stageId: string) => void;
    state: ConstructorScenarioState;
    produceState: (func: (draft: ConstructorScenarioState) => void) => void;
    addQueueTask: (stageId: string, task: ScriptBlockData) => void;
} & Partial<DataEditorProps>;

export const SideBar = () => {
    const [queryParams, setSearchParams] = useLocationSearchParams<{[s:string]: string}>();
    const lesson = useConstructorScenario();
    const storage = useConstructorStorage();

    const {state, produceState, runStage, addQueueTask, updateStages} = lesson;

    const currentTab = state.constructor.currentTab;

    const setCurrentTab = (tab:TabsEnum) => produceState((draft) => {
        draft.constructor.currentTab = tab;

        if (tab === TabsEnum.flowChart) {
            draft.constructor.isFlowEditorMode = true;
        } else {
            draft.constructor.isFlowEditorMode = false;
        }
    });

    const currentEditorStage = state.constructor.currentStage;

    const isDisabled = !storage.currentRevision
        || storage.isRevisionPublished(storage.currentRevision.id);

    const setCurrentEditorStage = (stage) => produceState((draft) => {
        draft.constructor.currentStage = stage;
        const locationCurrentStage = queryParams.get('stage');
        if (locationCurrentStage !== stage) {
            setSearchParams({stage: stage});
        }
    });

    const setState = (newState) => produceState((draft) => {
        const newStateKeys = Object.keys(newState);
        newStateKeys.forEach((key) => {
            draft[key] = newState[key];
        });
        Object.keys(draft).forEach((oldKey) => {
            if (newState[oldKey] === undefined) {
                delete draft[oldKey];
            }
        });
    });

    useEffect(() => {
        const locationCurrentStage = queryParams.get('stage');
        const firstStage = Object.keys(state.stages)[0];
        if (locationCurrentStage
            && locationCurrentStage !== state.constructor.currentStage) {
            setCurrentEditorStage(locationCurrentStage);
        }
        if (!locationCurrentStage) {
            if (state.constructor.currentStage) {
                setCurrentEditorStage(state.constructor.currentStage);
            } else {
                if (firstStage) {
                    setCurrentEditorStage(firstStage);
                }
            }
        }
    }, [queryParams]);

    return (
        <SideBarWrapper className="side-bar">
            <div className="tab-nav">
                {Object.keys(TabsEnum).map((key) =>
                    <Clickable
                        className={classNames({
                            active: TabsEnum[key] === currentTab,
                        })}
                        key={key}
                        onClick={() => setCurrentTab(TabsEnum[key])}
                    >
                        {TabsEnum[key]}
                    </Clickable>)
                }
            </div>

            <div className="content">
                {[TabsEnum.stages, TabsEnum.flowChart].includes(currentTab) &&
                    <StagesEditor
                        disabled={isDisabled}
                        state={state}
                        runStage={runStage}
                        produceState={produceState}
                        addQueueTask={addQueueTask}
                        updateStages={updateStages}
                        currentStage={currentEditorStage}
                        setCurrentStage={setCurrentEditorStage}
                    />
                }

                {currentTab === TabsEnum.scenes &&
                    <ScenesEditor
                        disabled={isDisabled}
                    />
                }

                {currentTab === TabsEnum.data &&
                    <DataEditor disabled={isDisabled} value={state} onChange={setState} />
                }

            </div>
        </SideBarWrapper>
    );
};
