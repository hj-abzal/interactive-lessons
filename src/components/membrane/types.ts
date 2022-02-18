import {DragModifier as ContextDragModifier} from '@/components/membrane/context';
import {MessageProps} from '@/components/chat/message';
import {Dispatch, SetStateAction, MutableRefObject} from 'react';

export interface AtomInfo {
    id: string;
    meta: Record<string, unknown>;
    coords: Coord;
}

export interface Coord {
    x: number;
    y: number;
}

export type CanalType = 'aquaporin'
    | 'protein-canal'
    | 'protein-carrier'
    | 'pump'
    | 'protein-symporter'
    | 'sinaps-na-canal'
    | 'sinaps-k-canal';

export type AtomType = 'oxygen'
    | 'water'
    | 'sodium'
    | 'glucose'
    | 'potassium'
    | 'bacterium'
    | 'undigested'
    | 'na'
    | 'k';
export type EnvType = 'inner' | 'outer';

export interface Pos extends Coord {
    height: number;
    width: number;
}

export type Condition = Partial<Record<AtomType, number>>;

interface CommonLevelArgs {
    refs: MutableRefObject<Record<string, LevelManagerRef>>;
    actions: MutableRefObject<{
        sendMessage: (message: MessageProps) => void;
    }>;
}

export interface OnDragStartArgs extends CommonLevelArgs {
    meta: Record<string, unknown> | undefined;
    rect: Pos;
}

export interface OnDragMoveArgs extends CommonLevelArgs {
    dropMeta: Record<string, unknown> | undefined;
}

export interface OnDragEndArgs extends CommonLevelArgs {
    oldAtoms: MutableRefObject<AtomInfo[]>;
    newAtom: AtomInfo;
    oldAtom: AtomInfo;
    transform: Coord;
    dropMeta: Record<string, unknown> | undefined;
    setAtoms: Dispatch<SetStateAction<AtomInfo[]>>;
}

export interface DragModifier {
    modifier: ContextDragModifier;
    onDragStart?: (args: OnDragStartArgs) => void;
    onDragEnd?: (args: OnDragEndArgs) => void;
    onDragMove?: (args: OnDragMoveArgs) => void;
}

export interface DragListener {
    onDragStart?: (args: OnDragStartArgs) => void;
    onDragEnd?: (args: OnDragEndArgs) => void;
    onDragMove?: (args: OnDragMoveArgs) => void;
}

export interface DragUpdater {
    onDragStart?: (args: OnDragStartArgs) => void;
    onDragEnd?: (args: OnDragEndArgs) => AtomInfo;
    onDragMove?: (args: OnDragMoveArgs) => void;
}

export interface Level {
    membraneCanals: CanalType[];
    membraneCanalsState: {
        [type: string]: {
            isOpen?: boolean,
        }
    }
    startConditions: Record<EnvType, Condition>;
    endConditions: Record<EnvType, Condition>;
    dragModifiers: Array<DragModifier>;
    dragListeners: Array<DragListener>;
    dragUpdaters: Array<DragUpdater>;
    nextStageId?: string;
    dragListenersReplicas?: Record<string, string>;
}
export interface LevelTableData {
    id: string;
    membraneCanal?: CanalType;
    membraneCanalsQty?: number;
    multiCanals?: CanalType[],
    startConditions: Record<EnvType, Condition>;
    endConditions: Record<EnvType, Condition>;
    dragModifiers: Array<string>;
    dragListeners: Array<string>;
    dragUpdaters: Array<string>;
    nextStageId?: string;
    mistakeStageId?: string;
    dragListenersReplicas?: Record<string, string>;
}

type ImageKey =
    | AtomType
    | 'bubble'
    | 'aquaporin'
    | 'protein-carrier'
    | 'protein-canal-open'
    | 'protein-canal-close'
    | 'pump-1'
    | 'pump-2'
    | 'pump-3'
    | 'pump-4'
    | 'symporter'
    | 'membrane'
    | 'usiki'
    | 'shariki';

export type Images = Partial<Record<ImageKey, string>>;
export interface IMembraneState {
    show: boolean;
    highlight: Highlight;
    currentLevel: Level;
    levels: LevelTableData[];
    conditions: Record<EnvType, Condition>;
    conditionsKey: string;
    endConditions: Record<EnvType, Condition>;
    runStage: (stageId: string) => void;
    onConditionChange: (condition: Record<EnvType, Condition>) => void;
    images: Images;
}

export interface Highlight {
    usiki: boolean;
    shariki: boolean;
    full: boolean;
}

export interface LevelManagerRef extends HTMLElement {
    /**
     * For atoms
     */
    setCoords?: Dispatch<SetStateAction<Coord>>;
    /**
     * For membrane and canals
     */
    setMeta?: Dispatch<SetStateAction<Record<string, unknown>>>;
}
