import React, {useEffect, useState} from 'react';
import {logger} from '@/utils/logger';
import {useForm} from 'react-hook-form';
import {Widget} from './widget';
import {Inputs, InputValues} from '@/components/constructor/side-bar/script-block/widget';
import classNames from 'classnames';
import {FullBoundStageParamData, StageParam} from '@/components/constructor/script-blocks/control-logic';
import {BoundStageParamsData} from '@/components/constructor/script-blocks/types';

export type ScriptBlockInputsProps = {
    isTableRowMode?: boolean;
    inputs: Inputs;
    inputValues: InputValues;
    index?: number;
    getSubstate: (fieldPath: string[]) => any;
    addValueToState: (path: string, value: any) => void;
    onChange?: (newData) => void;
    onChangeByIndex?: (ind: number, newData: any) => void;
    boundStageParams?: BoundStageParamsData,
    availableParamsToBind?: {
        [name: string]: StageParam,
    },
    bindInputToStageParam?: (params: {inputName: string, paramName?: string, tableItemPath?: string}) => void,
};

export const ScriptBlockInputs = React.memo(function ScriptBlockInputs({
    index,
    isTableRowMode,
    inputs,
    inputValues,
    getSubstate,
    addValueToState,
    boundStageParams,
    availableParamsToBind,
    bindInputToStageParam,
    onChange,
    onChangeByIndex,
}: ScriptBlockInputsProps) {
    const form = useForm({
        mode: 'onChange',
    });

    const [isValid, setValid] = useState(true);

    useEffect(() => {
        const subscription = form.watch((formData) => {
            if (!Number.isNaN(index) && onChangeByIndex) {
                onChangeByIndex(index as number, formData);
            }

            if (onChange) {
                onChange(formData);
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch, onChange]);

    const onSuccess = (val) => {
        logger.debug(val);
    };

    return <div className={classNames({row: isTableRowMode}, 'script-block_content')}>
        <form onSubmit={form.handleSubmit(onSuccess)}>
            {inputs && Object.keys(inputs).map((key) => {
                const input = inputs[key];
                const registerRules = {
                    required: input.isRequired,
                };

                const params: any = {
                    ...input,
                    name: key,
                    value: inputValues[key],
                    icon: inputs[key].type,
                    isTableRowMode: isTableRowMode,
                    inputValues: inputValues,
                };

                const boundStageParam: StageParam | undefined = boundStageParams?.[key]?.stageParamId
                    // @ts-ignore
                    ? availableParamsToBind?.[boundStageParams[key].stageParamId]
                    : undefined;

                const boundStageParamData: FullBoundStageParamData | undefined = boundStageParam
                    ? {
                        ...boundStageParam,
                        tableItemPath: boundStageParams?.[key]?.tableItemPath,
                    } : undefined;

                if ('searchable' in input) {
                    if (typeof input.searchable === 'string') {
                        const fieldPath = input.searchable.split('.');
                        if (fieldPath?.[0] !== 'root') {
                            fieldPath.unshift('root');
                        }
                        const subState = getSubstate(fieldPath);

                        params.searchable = subState;
                        params.addValueToState = addValueToState;
                    }
                }

                let isShown = true;

                if (input.showOn) {
                    isShown = false;
                    Object.keys(input.showOn).forEach((inputShowOnName) => {
                        const inputShowOnNameValue = form.getValues(inputShowOnName);
                        if (input.showOn![inputShowOnName].some((inputName) => inputName === inputShowOnNameValue)) {
                            isShown = true;
                        }
                    });
                }

                return isShown &&
                    <React.Fragment
                        key={`${input.label}`}
                    >
                        {input.isOverlined && <hr />}
                        <Widget
                            register={form.register(key, registerRules)}
                            rules={registerRules}
                            control={form.control}
                            error={form.formState.errors[key]}
                            isDirty={form.formState.dirtyFields[key] !== null}
                            clearError={() => {
                                logger.info('[CLEAR ERROR]: ', key);
                                form.clearErrors(key);
                                setValid(true);
                            }}
                            availableParamsToBind={availableParamsToBind}
                            bindInputToStageParam={bindInputToStageParam}
                            boundStageParam={boundStageParamData}
                            getSubstate={getSubstate}
                            addValueToState={addValueToState}
                            isValid={isValid}
                            type={input.type}
                            allWidgets={inputs}
                            params={params} />
                        {input.isUnderlined && <hr />}
                    </React.Fragment>;
            })}
        </form>
    </div>;
});
