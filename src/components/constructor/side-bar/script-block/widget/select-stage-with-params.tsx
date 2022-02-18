import React from 'react';
import {WidgetProps} from './index';
import {Controller} from 'react-hook-form';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import Creatable from 'react-select/creatable';
import {components} from 'react-select';
import {SelectSmallStyles} from './select';
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import Icon from '@/components/icon';
import styled from '@emotion/styled';
import SelectComponent from 'react-select';
import {Clickable} from '@/components/clickable';
import {css, useTheme} from '@emotion/react';
import {controlLogicScriptModule, ControlLogicState} from '@/components/constructor/script-blocks/control-logic';
import {ScriptBlockInputs} from '@/components/constructor/side-bar/script-block/inputs';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';

export const StageStyledOptionSmall = styled.div`
    position: relative;
    > button {
        position: absolute;
        padding: 4px;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        pointer-events: none;
        border-radius: 4px;
        transition: background-color 0.1s ease, color 0.1s ease;
        background-color: ${(p) => p.theme.colors.primary.light};
        color: ${(p) => p.theme.colors.primary.default};
        &:hover {
            color: ${(p) => p.theme.colors.grayscale.white};
            background-color: ${(p) => p.theme.colors.primary.default};
        }
    }
    &:hover, &.is-menu-open {
        > button {
            opacity: 1;
            pointer-events: auto;
        }
    }
`;

const paramInputTypesFallback = {
    [InputTypeType.select]: InputTypeType.textarea,
    [InputTypeType.multiKey]: InputTypeType.data,
};

const SelectStageWithParams: React.FC<any> = ({
    params,
    control,
    getSubstate,
    addValueToState,
}: WidgetProps) => {
    const {state, produceState, setCurrentEditorStage} = useConstructorScenario();
    const theme = useTheme();

    const controlLogicState: ControlLogicState = state.scriptModulesStates[controlLogicScriptModule.id];
    const stagesParams = controlLogicState?.stagesParams;

    return (
        <Controller
            render={({field}) => {
                const Option = (p) => {
                    return (
                        <StageStyledOptionSmall>
                            <components.Option {...p} />
                            <Clickable onClick={() => setCurrentEditorStage(p.value)}>
                                <Icon size={16} glyph='ArrowExternal'/>
                            </Clickable>
                        </StageStyledOptionSmall>
                    );
                };

                const selectedStageId = field.value?.stageId;

                const stageParams = stagesParams[selectedStageId]?.params;

                // Обратная совместимость не параметрическими стейджами
                if (typeof field.value === 'string' && Boolean(stageParams)) {
                    field.onChange({
                        stageId: field.value,
                        params: {},
                    });
                }

                const onChangeStageId = (stageId: string) => {
                    field.onChange({
                        ...((field.value && typeof field.value === 'object') ? field.value : {}),
                        stageId,
                    });
                };

                const onChangeStageRunParam = (paramName: string, value: any) => {
                    field.onChange({
                        stageId: typeof field.value === 'string' ? field.value : field.value?.stageId,
                        params: {
                            ...(field.value?.params || {}),
                            [paramName]: value,
                        },
                    });
                };

                const selectedStageValue = typeof field.value === 'string'
                    ? {label: field.value, value: field.value}
                    : {label: field.value?.stageId, value: field.value?.stageId};

                return (
                    <label
                        css={css`
                            display: flex;
                            flex-direction: column;
                        `}
                    >
                        <label css={css`height: auto !important; z-index: 1090`}>
                            <StyledWrapper css={(!field.value && !params.isTableRowMode) && OnCollapsedStyles}>
                                <Icon size={16} glyph={params.icon} />
                                {!params.isTableRowMode && params.label}

                                <Creatable
                                    css={SelectSmallStyles}
                                    {...field}
                                    onChange={(value) => {
                                        onChangeStageId(value ? value.value : '');
                                    }}
                                    isDisabled={params.isDisabled}
                                    components={{Option}}
                                    value={selectedStageValue}
                                    options={Object.keys(state.stages).map((id) => ({label: id, value: id}))}
                                    onCreateOption={(option) => {
                                        onChangeStageId(option);
                                        produceState((draft) => {
                                            draft.stages[option] = [];
                                        });
                                    }}
                                    isClearable={Boolean(field.value)}
                                    formatCreateLabel={(input) => `Создать новый сценарий ${input}`}
                                    noOptionsMessage={({inputValue}) => `Нет сценария ${inputValue}...`}
                                    classNamePrefix="input-select"
                                    isSearchable={true}
                                    openMenuOnFocus={true}
                                    placeholder={params.label || 'Название сценарной ветки'}
                                />

                                {field.value?.stageId &&
                                    <div
                                        css={css`
                                            position: absolute;
                                            bottom: 8px;
                                            right: 52px;
                                            cursor: pointer;
                                        `}
                                        onClick={() => setCurrentEditorStage(field.value.stageId)}
                                    >
                                        <Icon size={16} glyph='ArrowExternal' color={theme.colors.primary.default} />
                                    </div>
                                }
                            </StyledWrapper>
                        </label>

                        {stageParams && Object.keys(stageParams).map((paramName, index) => {
                            const stageParam = stageParams[paramName];

                            if (stageParam.tableIdRef) {
                                const tablePath = [
                                    'root',
                                    'scriptModulesStates',
                                    controlLogicScriptModule.id,
                                    'tables',
                                    stageParam.tableIdRef,
                                    'items'
                                ];

                                const tableState = getSubstate(tablePath) || [];

                                const templateParams = params.paramsPresets || [];

                                const itemsOptions = tableState.map((item) => ({label: item.id, value: item.id}))
                                    .concat(templateParams);

                                const paramValue = field.value?.params?.[paramName];

                                return (
                                    <label
                                        css={css`height: auto !important; z-index: 100${10 - index};`}
                                        key={stageParam.name}
                                    >
                                        <StyledWrapper>
                                            <Icon size={16} glyph="LinkBound" />
                                            {stageParam.name}

                                            <SelectComponent
                                                css={SelectSmallStyles}
                                                onChange={(option) => onChangeStageRunParam(paramName, option.value)}
                                                options={itemsOptions || []}
                                                value={paramValue && {label: paramValue, value: paramValue}}
                                                classNamePrefix="input-select"
                                                noOptionsMessage={({inputValue}) => `Нет вариантов ${inputValue}...`}
                                                isSearchable={true}
                                                formatCreateLabel={(input) => `Создать новое ${input}`}
                                                openMenuOnFocus={true}
                                                placeholder={'Элемент таблицы'}
                                            />
                                        </StyledWrapper>
                                    </label>);
                            }

                            if (!stageParam?.simpleType) {
                                return null;
                            }

                            return (
                                <label
                                    key={stageParam.name}
                                    css={css`height: auto !important; z-index: 100${10 - index};`}
                                >
                                    <ScriptBlockInputs
                                        // @ts-ignore
                                        inputs={{
                                            data: {
                                                type: paramInputTypesFallback[stageParam.simpleType]
                                                || stageParam.simpleType,
                                                label: stageParam.name,
                                                ...(stageParam.inputSettings || {}),
                                            },
                                        }}
                                        inputValues={{
                                            data: field.value?.params?.[stageParam.name],
                                        }}
                                        getSubstate={getSubstate}
                                        addValueToState={addValueToState}
                                        onChange={({data}) => {
                                            onChangeStageRunParam(stageParam.name, data);
                                        }}
                                    />
                                </label>
                            );
                        })}
                    </label>
                );
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};

export default SelectStageWithParams;
