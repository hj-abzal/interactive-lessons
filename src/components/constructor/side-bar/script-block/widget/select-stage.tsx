import React from 'react';
import {WidgetProps} from './index';
import {Controller} from 'react-hook-form';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import Creatable from 'react-select/creatable';
import {components} from 'react-select';
import {SelectSmallStyles} from './select';
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import {useLocationSearchParams} from '@/utils/use-location-query';
import Icon from '@/components/icon';
import styled from '@emotion/styled';
import {Clickable} from '@/components/clickable';
import {css, useTheme} from '@emotion/react';
import classNames from 'classnames';

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

const SelectStage: React.FC<any> = ({params, control}:WidgetProps) => {
    const {state, produceState} = useConstructorScenario();
    const theme = useTheme();

    const [queryParams, setSearchParams] = useLocationSearchParams<{[s:string]: string}>();

    // TODO: remove this logic from this component
    const setCurrentEditorStage = (stage) => produceState((draft) => {
        draft.constructor.currentStage = stage;
        const locationCurrentStage = queryParams.get('stage');
        if (locationCurrentStage !== stage) {
            setSearchParams({stage: stage});
        }
    });
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
                return (<label>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}
                    css={(!field.value && !params.isTableRowMode) && OnCollapsedStyles}
                    >
                        <Icon size={16} glyph={params.icon} />
                        {!params.isTableRowMode && params.label}
                        <Creatable
                            css={SelectSmallStyles}
                            {...field}
                            onChange={(value) => {
                                field.onChange(value && value.value || '');
                            }}
                            components={{Option}}
                            value={{label: field.value, value: field.value}}
                            options={Object.keys(state.stages).map((id) => ({label: id, value: id}))}
                            onCreateOption={(option) => {
                                field.onChange(option);
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
                        {field.value && <div
                            css={css`
                                position: absolute;
                                bottom: 8px;
                                right: 52px;
                                cursor: pointer;
                            `}
                            onClick={() => setCurrentEditorStage(field.value)}
                        >
                            <Icon size={16} glyph='ArrowExternal' color={theme.colors.primary.default} />
                        </div>}
                    </StyledWrapper>
                </label>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};

export default SelectStage;
