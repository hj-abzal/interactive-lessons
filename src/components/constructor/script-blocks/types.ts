import {Inputs, InputTypeResultMap, InputValues} from '@/components/constructor/side-bar/script-block/widget';
import {GlyphType} from '@/components/icon/glyphs';
import {ProviderProps} from '@/utils/create-safe-context';
import {EmotionJSX} from '@emotion/react/types/jsx-namespace';
import {ConstructorScenarioState} from '@/context-providers/constructor-scenario';
import {SberclassContextState} from '@/context-providers/sberclass';

export type ScriptModule<TState = any> = ScriptModuleConfig<TState> & {
    // implementation hook
    hook: ScriptModuleHook<TState>,
}

export type ScriptModuleConfig<TState = any> = {
    id: string;
    name: string;
    icon?: GlyphType;
    color: string;
    initialState?: TState;
    ContextProvider?: ({children}: ProviderProps) => EmotionJSX.Element;
    Component?: (any) => EmotionJSX.Element;
    useContext?: () => TState;
    callbacks?: { [k: string]: () => any };
}

export type ScriptModuleHook<TState> = () => {
    blocks: ScriptsBlockType<TState>;
}

export type ScriptsBlockType<TState> = { [key: string]: ScriptBlockBaseTypeGeneric<any, TState> };

export type ScriptBlockFuncContext<TState> = {
    moduleState: TState,
    globalState: ConstructorScenarioState,
    produceModuleState: (draftCb: (draft: TState) => void) => void;
    produceGlobalState: (draftCb: (draft: ConstructorScenarioState) => void) => void;
    runStage: (stage: string | {stageId: string, params?: any}) => void;
    currentStageId: string,
    sberclass: SberclassContextState,
}

export type ScriptBlockBaseTypeGeneric<IT extends Inputs = Inputs, TState = any> = {
    title: string;
    func: (
        inputs: { [key in keyof IT]: InputTypeResultMap[ IT[key]['type'] ] },
        context: ScriptBlockFuncContext<TState>,
    ) => void;
    inputs: IT;
    isBlocked?: boolean;
    isHidden?: boolean,
    isRunOnChangeInput?: boolean;
    isOnlyOnSetup?: boolean;
    nested?: {
        [areaName: string]: {
            label: string;
            defaultValue?: ScriptBlockData[];
        }
    }
}

export type ScriptBlockFull =
    ScriptBlockBaseTypeGeneric
    & ScriptModuleConfig
    & {
    moduleId: string,
    data: ScriptBlockData;
}

export type BoundStageParamsData = {
    [inputName: string]: {
        stageParamId: string,
        tableItemPath?: string,
    } | null | undefined,
}

export type ScriptBlockData = {
    dataId: string;
    scriptBlockId: string;
    isHighlighted?: boolean;
    inputValues: InputValues;
    nestedValues?: NestedInputValues;
    boundStageParams: BoundStageParamsData,
};

export type NestedInputValues = {
    [areaName: string]: ScriptBlockData[];
}

export enum UtilityStages {
    setup = 'setup',
    start = 'start'
}

export type ScriptTask = {
    stageId: string,
    id: string,
    stageParams?: any,
    data: ScriptBlockData,
}
