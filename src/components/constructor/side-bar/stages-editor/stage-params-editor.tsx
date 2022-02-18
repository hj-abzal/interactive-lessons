import React, {useCallback, useMemo} from 'react';
import {
    availableParamTypes,
    controlLogicScriptModule
} from '@/components/constructor/script-blocks/control-logic';
import {InputTable} from '@/components/constructor/side-bar/script-block/widget/input-table';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';
import _ from 'lodash';
import styled from '@emotion/styled';
import {usePopup} from '@/context-providers/popup';
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import {css, useTheme} from '@emotion/react';
import Button from '@/components/button';

const EditorWrapper = styled.div`
    width: 100vw;
`;

export const inputSettingsPresets = {
    'scene-nodes-names': {
        searchable: 'scriptModulesStates.scenesManager.nodes',
        valueName: 'name',
    },
    'scene-nodes-states': {
        searchable: 'scriptModulesStates.scenesManager.nodesStates',
        valueName: 'name',
    },
};

export const StageParamsEditor = () => {
    const theme = useTheme();
    const {saveStageParamsData, currentStageParamsConfig, state} = useConstructorScenario();

    const currentStageId = state.constructor.currentStage;

    const {addPopup} = usePopup();

    const getSubstate = useCallback((fieldPath: string[]) => {
        return _.get({root: state}, fieldPath);
    }, [state?.states, state?.scriptModulesStates]);

    const onDataChange = useMemo(() => {
        const onChangeFn = (data) => {
            if (!currentStageId) {
                return;
            }

            const preparedData = data.map((item) => {
                if (item.simpleType === InputTypeType.empty) {
                    return {
                        ...item,
                        simpleType: undefined,
                    };
                }

                if (item.inputPreset && inputSettingsPresets[item.inputPreset]) {
                    return {
                        ...item,
                        inputSettings: inputSettingsPresets[item.inputPreset],
                    };
                }

                return item;
            });

            saveStageParamsData(currentStageId, preparedData);
        };

        return _.debounce(onChangeFn, 500);
    }, [currentStageId]);

    if (!currentStageId) {
        return null;
    }

    return (
        <Button
            leftIcon='Constructor'
            size='small'
            className='first'
            theme={!_.isEmpty(currentStageParamsConfig) ? 'primary' : 'white'}
            onClick={() =>
                addPopup({
                    id: 'params-table',
                    content: <EditorWrapper>
                        <InputTable
                            getSubstate={getSubstate}
                            addValueToState={() => undefined}
                            inputs={{
                                name: {
                                    label: 'Имя',
                                    type: InputTypeType.textarea,
                                },
                                simpleType: {
                                    label: 'Тип',
                                    type: InputTypeType.select,
                                    options: availableParamTypes,
                                    defaultValue: InputTypeType.empty,
                                    isClearable: true,
                                },
                                inputSettings: {
                                    label: 'Настройки',
                                    type: InputTypeType.data,
                                    defaultValue: {
                                        searchable: '',
                                        valueName: '',
                                    },
                                },
                                inputPreset: {
                                    label: 'Пресеты',
                                    type: InputTypeType.select,
                                    options: Object.keys(inputSettingsPresets),
                                    isClearable: true,
                                },
                                tableIdRef: {
                                    label: 'Связать с таблицей',
                                    type: InputTypeType.key,
                                    searchable: `scriptModulesStates.${controlLogicScriptModule.id}.tables`,
                                    isClearable: true,
                                },
                                defaultValue: {
                                    label: 'Значение по умолчанию',
                                    type: InputTypeType.textarea,
                                },
                            }}
                            data={Object.values(currentStageParamsConfig || {})}
                            onChange={onDataChange}
                        />
                    </EditorWrapper>,
                    canClose: true,
                })
            }
            css={css`${theme.shadows.medium};`}
        />
    );
};
