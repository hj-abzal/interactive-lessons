import {ReactComponent as CartFilled} from './icons/CartFilled.svg';
import {ReactComponent as Search} from './icons/Search.svg';
import {ReactComponent as ActionsPlus} from './icons/ActionsPlus.svg';
import {ReactComponent as ArrowChevronDown} from './icons/ArrowChevronDown.svg';
import {ReactComponent as ArrowChevronForward} from './icons/ArrowChevronForward.svg';
import {ReactComponent as ArrowChevronBack} from './icons/ArrowChevronBack.svg';
import {ReactComponent as ArrowChevronUp} from './icons/ArrowChevronUp.svg';
import {ReactComponent as FacebookFilled} from './icons/FacebookFilled.svg';
import {ReactComponent as InstagramFilled} from './icons/InstagramFilled.svg';
import {ReactComponent as YouTubeFilled} from './icons/YouTubeFilled.svg';
import {ReactComponent as Delete} from './icons/Delete.svg';
import {ReactComponent as Play} from './icons/Play.svg';
import {ReactComponent as Refresh} from './icons/Refresh.svg';
import {ReactComponent as Loading} from './icons/Loading.svg';
import {ReactComponent as HamburgerMenu} from './icons/HamburgerMenu.svg';
import {ReactComponent as CloseX} from './icons/CloseX.svg';
import {ReactComponent as Expand} from './icons/Expand.svg';
import {ReactComponent as More} from './icons/More.svg';
import {ReactComponent as GridMenu} from './icons/GridMenu.svg';
import {ReactComponent as Skull} from './icons/Skull.svg';
import {ReactComponent as ZoomIn} from './icons/ZoomIn.svg';
import {ReactComponent as ZoomOut} from './icons/ZoomOut.svg';

import {ReactComponent as Lessons} from './icons/Lessons.svg';
import {ReactComponent as Constructor} from './icons/Constructor.svg';
import {ReactComponent as WorkFlower} from './icons/WorkFlower.svg';
import {ReactComponent as Images} from './icons/Images.svg';
import {ReactComponent as Replicas} from './icons/Replicas.svg';

import {ReactComponent as Handle} from './icons/Handle.svg';
import {ReactComponent as ArrowExternal} from './icons/ArrowExternal.svg';
import {ReactComponent as ArrayProvider} from './icons/ArrayProvider.svg';
import {ReactComponent as ChatProvider} from './icons/ChatProvider.svg';
import {ReactComponent as ComponentsProvider} from './icons/ComponentsProvider.svg';
import {ReactComponent as LogicProvider} from './icons/LogicProvider.svg';
import {ReactComponent as NumberInput} from './icons/NumberInput.svg';
import {ReactComponent as ObjectProvider} from './icons/ObjectProvider.svg';
import {ReactComponent as PlayInput} from './icons/PlayInput.svg';
import {ReactComponent as SelectInput} from './icons/SelectInput.svg';
import {ReactComponent as TextInput} from './icons/TextInput.svg';
import {ReactComponent as ToggleInput} from './icons/ToggleInput.svg';
import {ReactComponent as VariableInput} from './icons/VariableInput.svg';
import {ReactComponent as TimerProvider} from './icons/TimerProvider.svg';
import {ReactComponent as ProgressBarsProvider} from './icons/ProgressBarsProvider.svg';
import {ReactComponent as DNDConstructorProvider} from './icons/DNDConstructorProvider.svg';
// import {ReactComponent as ArrayInput} from './icons/ArrayInput.svg';
import {ReactComponent as MultiSelectInput} from './icons/MultiSelectInput.svg';
import {ReactComponent as ObjectInput} from './icons/ObjectInput.svg';
import {ReactComponent as TableInput} from './icons/TableInput.svg';
import {ReactComponent as CoordsInput} from './icons/CoordsInput.svg';
import {ReactComponent as ImageInput} from './icons/ImageInput.svg';

import {ReactComponent as CloseXBold} from './icons/CloseXBold.svg';

import {ReactComponent as NodeLayer} from './icons/NodeLayer.svg';
import {ReactComponent as NodeDropArea} from './icons/NodeDropArea.svg';
import {ReactComponent as NodeObject} from './icons/NodeObject.svg';
import {ReactComponent as NodePoint} from './icons/NodePoint.svg';
import {ReactComponent as NodeText} from './icons/NodeText.svg';
import {ReactComponent as NodePathAnimation} from './icons/NodePathAnimation.svg';

import {ReactComponent as Params} from './icons/Params.svg';

import {ReactComponent as LinkBound} from './icons/LinkBound.svg';
import {ReactComponent as LinkUnbound} from './icons/LinkUnbound.svg';

import {ReactComponent as InsertAfter} from './icons/InsertAfter.svg';
import {ReactComponent as InsertIn} from './icons/InsertIn.svg';

// TODO сделать автоматизированно
const glyphs = {
    CartFilled,
    Search,
    ActionsPlus,
    ArrowChevronDown,
    ArrowChevronForward,
    ArrowChevronBack,
    ArrowChevronUp,
    FacebookFilled,
    InstagramFilled,
    Play,
    Refresh,
    YouTubeFilled,
    HamburgerMenu,
    Delete,
    Loading,
    CloseX,
    Expand,
    ArrayProvider,
    ChatProvider,
    ComponentsProvider,
    LogicProvider,
    ObjectProvider,
    TimerProvider,
    ProgressBarsProvider,
    DNDConstructorProvider,
    More,
    GridMenu,
    Skull,
    ZoomIn,
    ZoomOut,
    ArrowExternal,
    Lessons,
    Constructor,
    WorkFlower,
    Images,
    Replicas,
    CloseXBold,
    Handle,
    number: NumberInput,
    stage: PlayInput,
    stages: PlayInput,
    select: SelectInput,
    multiKey: MultiSelectInput,
    key: SelectInput,
    path: ObjectInput,
    textarea: TextInput,
    toggle: ToggleInput,
    data: ObjectInput,
    table: TableInput,
    state: VariableInput,
    auto: VariableInput,
    coords: CoordsInput,
    doubleNumber: CoordsInput,
    image: ImageInput,
    NodeLayer,
    NodeDropArea,
    NodeObject,
    NodePoint,
    NodeText,
    NodeStrictWrapper: GridMenu,
    NodePathAnimation,
    Params,
    LinkBound,
    LinkUnbound,
    InsertAfter,
    InsertIn,
};

export default glyphs;

export type GlyphType = keyof typeof glyphs;
