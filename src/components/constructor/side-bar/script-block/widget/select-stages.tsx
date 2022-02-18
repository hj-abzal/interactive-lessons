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
import {Clickable} from '@/components/clickable';
import {StageStyledOptionSmall} from './select-stage';
import classNames from 'classnames';

const SelectStages: React.FC<any> = ({params, control}:WidgetProps) => {
    const {state, produceState} = useConstructorScenario();

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
                            className='multi-select'
                            classNamePrefix="input-select"
                            css={SelectSmallStyles}
                            {...field}
                            onChange={(value) =>
                                field.onChange(value.map((val) => val.value))}
                            value={Array.isArray(field.value)
                                ? field.value.map((val) => ({label: val, value: val}))
                                : []}
                            components={{Option}}
                            options={Object.keys(state.stages).map((id) => ({label: id, value: id}))}
                            onCreateOption={(option) => {
                                const value = Array.isArray(field.value)
                                    ? field.value
                                    : [];
                                field.onChange(value.concat([option]));
                                produceState((draft) => {
                                    draft.stages[option] = [];
                                });
                            }}
                            isClearable={Boolean(field.value)}
                            formatCreateLabel={(input) => `Создать новый сценарий ${input}`}
                            noOptionsMessage={({inputValue}) => `Нет сценария ${inputValue}...`}
                            isMulti={true}
                            isSearchable={true}
                            openMenuOnFocus={true}
                            blurInputOnSelect={false}
                            closeMenuOnSelect={false}
                            placeholder={params.label || 'Название сценарной ветки'}
                        />
                    </StyledWrapper>
                </label>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};

export default SelectStages;
