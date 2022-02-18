import React from 'react';
import TextArea from './text-area';
import Toggle from './toggle';
import Select from './select';
import {FullBoundStageParamData, StageParam} from '@/components/constructor/script-blocks/control-logic';
import NumberInput from './number-input';
import DataInput from './data-input';
import SelectPath from './select-path';
import SelectKey from './select-key';
import SelectMultiKey from './select-multi-key';
import DataTable from './data-table';
import SelectImage from './select-image';
import CoordsInput from './coords-input';
import SelectStages from './select-stages';
import DataSceneEditor from './data-scene-editor';
import SelectStageWithParams from '@/components/constructor/side-bar/script-block/widget/select-stage-with-params';
import IdInput from './id-input';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';
import {GenericTableInput} from '@/components/constructor/side-bar/script-block/widget/generic-table';
import {ConstructorScenarioState} from '@/context-providers/constructor-scenario';
import {InputWithParams} from '@/components/constructor/side-bar/script-block/widget/input-with-params';
import NumberDoubleInput from './number-double-input';

export type RunStageParams = string | {
    stageId: string,
    params: any,
};

export type ParamPreset = {
    label: string,
    value: string,
}

export type InputTypeResultMap = {
  [InputTypeType.id]: string;
  [InputTypeType.number]: number;
  [InputTypeType.select]: string;
  [InputTypeType.toggle]: boolean;
  [InputTypeType.data]: any;
  [InputTypeType.auto]: any;
  [InputTypeType.stage]: RunStageParams;
  [InputTypeType.stages]: string[];
  [InputTypeType.path]: string;
  [InputTypeType.image]: string;
  [InputTypeType.textarea]: string;
  [InputTypeType.table]: any;
  [InputTypeType.key]: string;
  [InputTypeType.multiKey]: string[];
  [InputTypeType.coords]: { x: number; y: number };
  [InputTypeType.doubleNumber]: Record<string, number>;
  [InputTypeType.scene]: any;
  [InputTypeType.genericTable]: {
      items: any[],
      columns: any[],
  }
}

export const components = {
    [InputTypeType.id]: IdInput,
    [InputTypeType.textarea]: TextArea,
    [InputTypeType.number]: NumberInput,
    [InputTypeType.select]: Select,
    [InputTypeType.toggle]: Toggle,
    [InputTypeType.data]: DataInput,
    [InputTypeType.table]: DataTable,
    [InputTypeType.path]: SelectPath,
    [InputTypeType.image]: SelectImage,
    [InputTypeType.auto]: TextArea,
    [InputTypeType.stage]: SelectStageWithParams,
    [InputTypeType.stages]: SelectStages,
    [InputTypeType.key]: SelectKey,
    [InputTypeType.multiKey]: SelectMultiKey,
    [InputTypeType.coords]: CoordsInput,
    [InputTypeType.doubleNumber]: NumberDoubleInput,
    [InputTypeType.scene]: DataSceneEditor,
    [InputTypeType.genericTable]: GenericTableInput,
};

export type SearchableFilter = (
  item: any,
  itemKey: string | number,
  globalState: ConstructorScenarioState,
  inputsValues: InputValues
) => boolean

interface InputTypeBase {
  label: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isOverlined?: boolean;
  isUnderlined?: boolean;
  isHidden?: boolean;
  placeholder?: string;
  showOn?: {
    [inputName: string]: any[];
  };
}

interface WidgetIdInputProps extends InputTypeBase {
  type: InputTypeType.id;
  defaultValue?: string;
  autoGenerate?: boolean,
}

interface WidgetTextAreaProps extends InputTypeBase {
  type: InputTypeType.textarea;
  defaultValue?: string;
}

interface WidgetNumberProps extends InputTypeBase {
  type: InputTypeType.number;
  defaultValue?: number;
  unit?: string;
}

interface WidgetSelectProps extends InputTypeBase {
  type: InputTypeType.select;
  defaultValue?: string;
  options: string[];
  isClearable?: boolean;
}

interface WidgetToggleProps extends InputTypeBase {
  type: InputTypeType.toggle;
  defaultValue?: boolean;
}

interface WidgetDataProps extends InputTypeBase {
  type: InputTypeType.data;
  defaultValue?: any;
}

interface WidgetTableProps extends InputTypeBase {
  type: InputTypeType.table;
  defaultValue?: any[];
  inputs: Inputs;
}

interface WidgetAutoProps extends InputTypeBase {
  type: InputTypeType.auto;
  defaultValue?: any;
  dataInputId: string;
}

interface WidgetStageProps extends InputTypeBase {
  type: InputTypeType.stage;
  defaultValue?: string;
  paramsPresets?: ParamPreset[];
}

interface WidgetStagesProps extends InputTypeBase {
  type: InputTypeType.stages;
  defaultValue?: string[];
}

interface WidgetPathProps extends InputTypeBase {
  type: InputTypeType.path;
  defaultValue?: any;
  searchable: string | Record<string, any>;
}

interface WidgetImageProps extends InputTypeBase {
  type: InputTypeType.image;
  defaultValue?: string;
}

interface WidgetKeysProps extends InputTypeBase {
  type: InputTypeType.key;
  defaultValue?: any;
  searchable: string | Record<string, any>;
  isCreatable?: boolean;
  isClearable?: boolean;
  valueName?: string;
  autoSelectFirst?: boolean;
  searchableFilter?: SearchableFilter;
}

interface WidgetMultiProps extends InputTypeBase {
  type: InputTypeType.multiKey;
  defaultValue?: any;
  searchable: string | Record<string, any>;
  isCreatable?: boolean;
  valueName?: string;
  isShowSelectedOptions?: boolean;
  searchableFilter?: SearchableFilter;
}

interface WidgetCoordsProps extends InputTypeBase {
  type: InputTypeType.coords;
  defaultValue?: { x: number; y: number };
}

interface WidgetNumberDoubleProps extends InputTypeBase {
  type: InputTypeType.doubleNumber;
  valueNames: [valName1: string, valName2: string],
  defaultValue?: Record<string, number>;
}

interface WidgetLayersObjectsProps extends InputTypeBase {
  type: InputTypeType.scene;
  defaultValue?: any;
}

interface WidgetGenericTableProps extends InputTypeBase {
    type: InputTypeType.genericTable;
    defaultValue?: {
        items: InputValues[],
        columns: InputValues[],
    }
}

export type InputType =
  | WidgetIdInputProps
  | WidgetStageProps
  | WidgetStagesProps
  | WidgetTextAreaProps
  | WidgetNumberProps
  | WidgetPathProps
  | WidgetImageProps
  | WidgetKeysProps
  | WidgetSelectProps
  | WidgetToggleProps
  | WidgetDataProps
  | WidgetTableProps
  | WidgetAutoProps
  | WidgetMultiProps
  | WidgetCoordsProps
  | WidgetNumberDoubleProps
  | WidgetLayersObjectsProps
  | WidgetGenericTableProps;

export interface TemplateParams {
  [key: string]: any;
}

export interface WidgetsState {
  activated: boolean;
}

export interface WidgetProps {
  type: InputTypeType;
  params: TemplateParams;
  getSubstate: (fieldPath: string[]) => any;
  addValueToState: (path: string, value: any) => void;
  bindInputToStageParam?: (params: {inputName: string, paramName?: string, tableItemPath?: string}) => void;
  availableParamsToBind?: {
        [name: string]: StageParam,
  };
  boundStageParam?: FullBoundStageParamData,
  register: any;
  control: any;
  rules: any;
  clearError: () => void;
  error?: boolean;
  isValid?: boolean;
  isDirty?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  allWidgets: Inputs;
}

export interface Inputs {
  [key: string]: InputType;
}

export type InputValues = {
  [inputName: string]: any;
}

export const Widget = ({
    register,
    control,
    rules,
    error,
    clearError,
    type,
    isValid,
    isDirty,
    params,
    getSubstate,
    addValueToState,
    availableParamsToBind,
    bindInputToStageParam,
    boundStageParam,
    ...props
}: WidgetProps) => {
    const InputComponent = components[type];

    const isAvailableToBindStageParam = bindInputToStageParam
        && availableParamsToBind
        && Object.values(availableParamsToBind).some((param) => param.simpleType === type || param.tableIdRef);

    if (isAvailableToBindStageParam) {
        return <InputWithParams
            register={register}
            control={control}
            rules={rules}
            error={error}
            clearError={clearError}
            type={type}
            isValid={isValid}
            isDirty={isDirty}
            params={params}
            getSubstate={getSubstate}
            addValueToState={addValueToState}
            availableParamsToBind={availableParamsToBind}
            bindInputToStageParam={bindInputToStageParam}
            boundStageParam={boundStageParam}
            {...props}
        />;
    }

    return <InputComponent
        {...({register} as any)}
        control={control}
        rules={rules}
        getSubstate={getSubstate}
        addValueToState={addValueToState}
        clearError={clearError}
        error={error}
        isValid={isValid}
        isDirty={isDirty}
        params={params}
    />;
};
