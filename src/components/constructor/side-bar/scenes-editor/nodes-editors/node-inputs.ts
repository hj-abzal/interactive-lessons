import glyphs from '@/components/icon/glyphs';
import {InputTypeType} from '../../script-block/widget/types';
import {
    commonNodesStatesIds,
    FlexAlignEnum,
    NodeTypeEnum,
    ScenesManagerStateType,
    TextAlignEnum
} from '@/components/scenes-manager/types';
import {Inputs} from '../../script-block/widget';
import {IconProps} from '@/components/icon';
import {SCENES_MANAGER_SCRIPT_MODULE_ID} from '@/context-providers/constructor-scenario';
import {NodePathAnimationModes} from '@/components/scenes-manager/nodes/node-path-animation';
import {AnimeEasingNames} from '@/utils/anime-easing-enum';

const stylesInputs: Inputs = {
    isHidden: {
        label: 'Скрыть?',
        type: InputTypeType.toggle,
    },
    transform: {
        label: 'Строка трансформации',
        type: InputTypeType.textarea,
        placeholder: 'translate(0%, 0%) scale(1, 1) rotate(0deg)',
    },
    transition: {
        label: 'Строка анимации перехода',
        type: InputTypeType.textarea,
        placeholder: '0.5s ease',
    },
    filter: {
        label: 'Строка фильтров',
        type: InputTypeType.textarea,
        placeholder: 'blur(20px) grayscale(50%) contrast(150%)',
    },
};

const coordsInputs: Inputs = {
    coords: {
        label: 'Позиция XY (px)',
        type: InputTypeType.doubleNumber,
        valueNames: ['x', 'y'],
    },
};

const interactionInputs: Inputs = {
    onClickRunStage: {
        isOverlined: true,
        label: 'При клике запустить сценарий',
        type: InputTypeType.stage,
        isUnderlined: true,
    },
    interactionTag: {
        label: 'Общий тег связи',
        type: InputTypeType.key,
        searchable: 'scriptModulesStates.scenesManager.interactionTags',
        isCreatable: true,
        isClearable: true,
    },
};

const dimensionsInputs: Inputs = {
    dimensions: {
        label: 'Размер ширина, высота (px)',
        type: InputTypeType.doubleNumber,
        valueNames: ['w', 'h'],
    },
};

const commonRequiredInputs: Inputs = {
    id: {
        label: 'id',
        type: InputTypeType.id,
        isHidden: true,
    },
    currentStateName: {
        label: 'Состояние',
        type: InputTypeType.key,
        searchable: `scriptModulesStates.${SCENES_MANAGER_SCRIPT_MODULE_ID}.nodesStates`,
        valueName: 'name',
        searchableFilter:
        (item:ScenesManagerStateType['scenes'], itemKey, globalState, inputsValues) => {
            const moduleState =
                globalState.scriptModulesStates[SCENES_MANAGER_SCRIPT_MODULE_ID] as ScenesManagerStateType;
            const currentNode = moduleState.nodes[inputsValues.id];

            const currentNodeStatesIds = [...commonNodesStatesIds, ...currentNode.nodeStatesIds];

            return Boolean(currentNodeStatesIds.includes(itemKey.toString()));
        },
        autoSelectFirst: true,
        isCreatable: true,
        isUnderlined: true,
    },
};

export const inputs: Record<string, Inputs> = {
    [NodeTypeEnum.Object]: {
        name: {
            label: 'Название объекта (id)',
            type: InputTypeType.id,
        },
        type: {
            label: 'type',
            type: InputTypeType.select,
            options: Object.values(NodeTypeEnum),
            defaultValue: NodeTypeEnum.Object,
            isHidden: true,
        },
        ...commonRequiredInputs,
        src: {
            label: 'img',
            type: InputTypeType.image,
        },
        ...coordsInputs,
        ...dimensionsInputs,
        ...stylesInputs,
        keyframes: {
            label: 'Строка keyframes',
            type: InputTypeType.textarea,
            placeholder: 'from {width: 0px} to {width: 1000px}',
        },
        animKeyframes: {
            label: 'Строка анимации для keyframes',
            type: InputTypeType.textarea,
            placeholder: '5s infinite',
        },
        ...interactionInputs,
        isUnclickable: {
            label: 'Некликабельный?',
            type: InputTypeType.toggle,
        },
        isDraggable: {
            label: 'Перетаскиваемый',
            type: InputTypeType.toggle,
            defaultValue: false,
        },
        dropTag: {
            label: 'Дроп-тег',
            type: InputTypeType.key,
            searchable: 'scriptModulesStates.scenesManager.dropTags',
            isCreatable: true,
            isClearable: true,
        },
        styles: {
            label: 'styles',
            type: InputTypeType.data,
            defaultValue: {
                default: {},
                onHover: {},
                onActive: {},
                onError: {},
                onMouseDown: {},
            },
        },
    },
    [NodeTypeEnum.StrictWrapper]: {
        name: {
            label: 'Название обертки (id)',
            type: InputTypeType.id,
        },
        type: {
            label: 'type',
            type: InputTypeType.select,
            options: Object.values(NodeTypeEnum),
            defaultValue: NodeTypeEnum.StrictWrapper,
            isHidden: true,
        },
        ...commonRequiredInputs,
        ...coordsInputs,
        ...dimensionsInputs,
        ...stylesInputs,
        isUnclickable: {
            label: 'Некликабельный?',
            type: InputTypeType.toggle,
        },
        isVertical: {
            label: 'Элементы по вертикали?',
            type: InputTypeType.toggle,
        },
        gridGap: {
            label: 'Расстояние между элементами',
            type: InputTypeType.textarea,
            placeholder: '10px',
        },
        padding: {
            label: 'Внутренний отступ обертки',
            type: InputTypeType.textarea,
            placeholder: '0px 20px',
        },
        alignItems: {
            label: 'Позиционирование элементов',
            type: InputTypeType.select,
            options: Object.values(FlexAlignEnum),
            defaultValue: FlexAlignEnum.Center,
        },
        styles: {
            label: 'styles',
            type: InputTypeType.data,
            defaultValue: {
                wrapper: {},
                item: {},
            },
        },
    },
    [NodeTypeEnum.Layer]: {
        name: {
            label: 'Название слоя (id)',
            type: InputTypeType.id,
        },
        type: {
            label: 'type',
            type: InputTypeType.select,
            options: Object.values(NodeTypeEnum),
            defaultValue: NodeTypeEnum.Layer,
            isHidden: true,
        },
        ...commonRequiredInputs,
        src: {
            label: 'img',
            type: InputTypeType.image,
        },
        isUnclickable: {
            label: 'Некликабельный?',
            type: InputTypeType.toggle,
        },
        ...stylesInputs,
    },
    [NodeTypeEnum.Point]: {
        name: {
            label: 'Название точки (id)',
            type: InputTypeType.id,
        },
        type: {
            label: 'type',
            type: InputTypeType.select,
            options: Object.values(NodeTypeEnum),
            defaultValue: NodeTypeEnum.Point,
            isHidden: true,
        },
        ...commonRequiredInputs,
        isHidden: {
            label: 'Скрыть?',
            type: InputTypeType.toggle,
        },
        ...coordsInputs,
        rotate: {
            label: 'Поворот (градус)',
            type: InputTypeType.number,
        },
        icon: {
            label: 'Иконка',
            type: InputTypeType.select,
            isClearable: true,
            options: Object.keys(glyphs),
            defaultValue: 'ArrowChevronUp',
        },
        ...interactionInputs,
    },
    [NodeTypeEnum.DropArea]: {
        name: {
            label: 'Название зоны для перетаскивания (id)',
            type: InputTypeType.id,
        },
        type: {
            label: 'type',
            type: InputTypeType.select,
            options: Object.values(NodeTypeEnum),
            defaultValue: NodeTypeEnum.DropArea,
            isHidden: true,
        },
        ...commonRequiredInputs,
        acceptedNodes: {
            label: 'Название верного объекта',
            type: InputTypeType.key,
            searchable: 'scriptModulesStates.scenesManager.nodes',
            valueName: 'name',
        },
        isHighlighted: {
            label: 'Подсветить',
            type: InputTypeType.toggle,
        },
        isHidden: {
            label: 'Скрыть?',
            type: InputTypeType.toggle,
        },
        onDropRunStage: {
            label: 'Запустить сценарий при попадании',
            type: InputTypeType.stage,
        },
        onErrorRunStage: {
            label: 'Запустить сценарий при ошибке',
            type: InputTypeType.stage,
        },
        ...coordsInputs,
        ...dimensionsInputs,
        ...interactionInputs,
        acceptsTags: {
            label: 'Фильтр дроп-тегов',
            type: InputTypeType.table,
            inputs: {
                tag: {
                    label: 'Тег',
                    type: InputTypeType.textarea,
                },
                runStage: {
                    label: 'Сценарий',
                    type: InputTypeType.stage,
                },
                asDefault: {
                    label: 'Принимать любой',
                    type: InputTypeType.toggle,
                },
            },
        },
    },
    [NodeTypeEnum.Text]: {
        name: {
            label: 'Название текста (id)',
            type: InputTypeType.id,
        },
        type: {
            label: 'type',
            type: InputTypeType.select,
            options: Object.values(NodeTypeEnum),
            defaultValue: NodeTypeEnum.Text,
            isHidden: true,
        },
        ...commonRequiredInputs,
        text: {
            label: 'Текст',
            type: InputTypeType.textarea,
            placeholder: 'Введи текст',
        },
        color: {
            label: 'Цвет',
            type: InputTypeType.textarea,
            placeholder: '#00000',
        },
        align: {
            label: 'Позиционирование',
            type: InputTypeType.select,
            options: Object.values(TextAlignEnum),
            defaultValue: TextAlignEnum.Left,
        },
        ...coordsInputs,
    },
    [NodeTypeEnum.PathAnimation]: {
        name: {
            label: 'Название анимации (id)',
            type: InputTypeType.id,
        },
        type: {
            label: 'type',
            type: InputTypeType.select,
            options: Object.values(NodeTypeEnum),
            defaultValue: NodeTypeEnum.PathAnimation,
            isHidden: true,
        },
        ...commonRequiredInputs,
        pointsQty: {
            label: 'Количество',
            type: InputTypeType.number,
            placeholder: 'Введи количество',
            defaultValue: 1,
        },
        pointSize: {
            label: 'Размер',
            type: InputTypeType.number,
            placeholder: 'Введи размер',
            defaultValue: 20,
        },
        delay: {
            label: 'Задержка между точками',
            type: InputTypeType.number,
            placeholder: 'Введи задержку',
            defaultValue: 500,
        },
        duration: {
            label: 'Время пути точки',
            type: InputTypeType.number,
            placeholder: 'Введи время пути',
            defaultValue: 2000,
        },
        pointEasing: {
            label: 'Кривая анимации движения точки',
            type: InputTypeType.select,
            options: Object.values(AnimeEasingNames),
            defaultValue: AnimeEasingNames.linear,
        },
        pointColor: {
            label: 'Цвет фона точки',
            type: InputTypeType.textarea,
            defaultValue: '#C65F00',
            placeholder: '#FF00EE',
        },
        pointTextColor: {
            label: 'Цвет текста точки',
            type: InputTypeType.textarea,
            defaultValue: '#FFFFFF',
            placeholder: '#FF00EE',
        },
        pointText: {
            label: 'Текст на точке',
            type: InputTypeType.textarea,
            placeholder: 'Na',
        },
        pathColor: {
            label: 'Цвет пути движения',
            type: InputTypeType.textarea,
            defaultValue: 'transparent',
            placeholder: '#FF00EE',
        },
        svgPath: {
            label: 'SVG путь движения',
            type: InputTypeType.textarea,
            defaultValue: 'M0 0L100 60',
            placeholder: 'M0 0L100 60',
        },
        isRotateByPath: {
            label: 'Вращать точки по пути?',
            type: InputTypeType.toggle,
            defaultValue: true,
        },
        mode: {
            label: 'Режим',
            type: InputTypeType.select,
            options: Object.values(NodePathAnimationModes),
            defaultValue: NodePathAnimationModes.infiniteLoop,
        },
        ...coordsInputs,
        isHidden: {
            label: 'Скрыть?',
            type: InputTypeType.toggle,
        },
        transition: {
            label: 'Строка анимации перехода пути',
            type: InputTypeType.textarea,
            placeholder: '0.5s ease',
        },
    },
};

export const iconGlyphByType: Record<NodeTypeEnum, IconProps['glyph']> = {
    [NodeTypeEnum.Object]: 'NodeObject',
    [NodeTypeEnum.StrictWrapper]: 'NodeStrictWrapper',
    [NodeTypeEnum.Layer]: 'NodeLayer',
    [NodeTypeEnum.Point]: 'NodePoint',
    [NodeTypeEnum.DropArea]: 'NodeDropArea',
    [NodeTypeEnum.Text]: 'NodeText',
    [NodeTypeEnum.PathAnimation]: 'NodePathAnimation',
    [NodeTypeEnum.Root]: 'ObjectProvider',
    [NodeTypeEnum.EditingOverlay]: 'ObjectProvider',
};

export const uneditableInputsByType: Record<NodeTypeEnum, {
    disabled: string[],
    hidden: string[],
    removedOnOverride: string[],
    disabledOnOverride: string[],
}> = {
    [NodeTypeEnum.Object]: {
        disabled: ['name'],
        hidden: [],
        removedOnOverride: [],
        disabledOnOverride: [
            'coords',
            'dimensions',
            'src'
        ],
    },
    [NodeTypeEnum.StrictWrapper]: {
        disabled: ['name'],
        hidden: [],
        removedOnOverride: [],
        disabledOnOverride: [
            'coords',
            'dimensions'
        ],
    },
    [NodeTypeEnum.Layer]: {
        disabled: ['name', 'src'],
        hidden: [],
        removedOnOverride: [],
        disabledOnOverride: [],
    },
    [NodeTypeEnum.Point]: {
        disabled: ['name'],
        hidden: [],
        removedOnOverride: [],
        disabledOnOverride: [],
    },
    [NodeTypeEnum.DropArea]: {
        disabled: ['name'],
        hidden: [],
        removedOnOverride: [],
        disabledOnOverride: ['acceptsTags'],
    },
    [NodeTypeEnum.Root]: {
        disabled: ['name'],
        hidden: [],
        removedOnOverride: [],
        disabledOnOverride: [],
    },
    [NodeTypeEnum.Text]: {
        disabled: ['name'],
        hidden: [],
        removedOnOverride: [],
        disabledOnOverride: [],
    },
    [NodeTypeEnum.EditingOverlay]: {
        disabled: ['name'],
        hidden: [],
        removedOnOverride: [],
        disabledOnOverride: [],
    },
    [NodeTypeEnum.PathAnimation]: {
        disabled: ['name'],
        hidden: [],
        removedOnOverride: [],
        disabledOnOverride: [],
    },
};
