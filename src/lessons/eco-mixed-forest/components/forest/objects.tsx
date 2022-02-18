import ekosistemaSmeshanniiLes from '@/codgen/ekosistemaSmeshanniiLes';
import {LayerObjectType} from '@/components/interactive-parallax/layer-object';
import {ReactComponent as beryoza1Lisaya} from './objects-masks/beryoza1Lisaya.svg';
import {ReactComponent as beryoza2Lisaya} from './objects-masks/beryoza2Lisaya.svg';
import {ReactComponent as trava1} from './objects-masks/trava1.svg';
import {ReactComponent as trava2} from './objects-masks/trava2.svg';
import {ReactComponent as yel} from './objects-masks/yel.svg';
import {AvailableMembersMap, ForestMemberType, MemberType} from '@/lessons/eco-mixed-forest/context/types';

type Options = {
    availableMembersMap: AvailableMembersMap,
    targetMembers: {
        [key in ForestMemberType]?: boolean
    },
    onMemberClick: (type: MemberType) => void,
    selectedMembers: MemberType[],
    isClickable: boolean,
    showSelectionError?: boolean,
    isSelectionHighlighted?: boolean,
}

type ExtendedLayerType = LayerObjectType & {
    type?: ForestMemberType,
}

export const createObjects = ({
    availableMembersMap,
    onMemberClick,
    showSelectionError,
    selectedMembers,
    isClickable,
    isSelectionHighlighted,
}: Options): ExtendedLayerType[] => {
    const objects: ExtendedLayerType[] = [
        {
            type: ForestMemberType.Grass,
            name: 'trava1',
            x: 0,
            y: 69,
            w: 100,
            src: ekosistemaSmeshanniiLes.rasteniya.trava1,
            ClickableMaskSVG: trava1,
            isSetStylesOnMask: true,
        },
        {
            // Попросили убрать
            // type: ForestMemberType.BirchBig,
            name: 'beryoza1Lisaya',
            x: 21,
            y: -24,
            w: 20,
            src: ekosistemaSmeshanniiLes.derevya.beryoza1Lisaya,
            ClickableMaskSVG: beryoza1Lisaya,
        },
        {
            name: 'duplo1',
            x: 28.3,
            y: 34.1,
            w: 1.3,
            src: ekosistemaSmeshanniiLes.derevya.duplo1,
            isUnclickable: true,
        },
        {
            type: ForestMemberType.Squirrel,
            name: 'belka',
            x: 30,
            y: 24,
            w: 2.5,
            src: ekosistemaSmeshanniiLes.zhivotnie.belka,
            transform: 'rotateY(180deg)',
        },
        {
            name: 'grib',
            x: 33,
            y: 68,
            w: 2.5,
            src: ekosistemaSmeshanniiLes.rasteniya.grib,
            type: ForestMemberType.Mushroom,
        },
        {
            name: 'zayats',
            x: 33,
            y: 79,
            w: 5,
            src: ekosistemaSmeshanniiLes.zhivotnie.zayats,
            type: ForestMemberType.Hare,
        },
        {
            name: 'lyagushka',
            x: 44,
            y: 92,
            w: 3,
            src: ekosistemaSmeshanniiLes.zhivotnie.lyagushka,
            type: ForestMemberType.Frog,
        },
        {
            name: 'zmeya',
            x: 65,
            y: 76,
            w: 7,
            src: ekosistemaSmeshanniiLes.zhivotnie.zmeya,
            transform: 'rotateY(180deg)',
            type: ForestMemberType.Snake,
        },
        {
            name: 'trava2',
            x: 0,
            y: 56.5,
            w: 100,
            src: ekosistemaSmeshanniiLes.rasteniya.trava2,
            ClickableMaskSVG: trava2,
            isSetStylesOnMask: true,
            type: ForestMemberType.Grass,
        },
        {
            name: 'volk',
            x: 49,
            y: 64,
            w: 9,
            src: ekosistemaSmeshanniiLes.zhivotnie.volk,
            transform: 'rotateY(180deg)',
            type: ForestMemberType.Wolf,
        },
        {
            name: 'lisa',
            x: 35,
            y: 65,
            w: 9,
            src: ekosistemaSmeshanniiLes.zhivotnie.lisa,
            type: ForestMemberType.Fox,
        },
        {
            name: 'beryozaMini',
            x: 59,
            y: 45,
            w: 8,
            src: ekosistemaSmeshanniiLes.beryozaMini,
            type: ForestMemberType.BirchSmall,
        },
        {
            name: 'yelFonovaya',
            x: 23,
            y: 45,
            w: 8,
            src: ekosistemaSmeshanniiLes.derevya.yelFonovaya,
            transform: 'scaleY(1.15)',
            type: ForestMemberType.FirSmall,
        },
        {
            name: 'beryoza2Lisaya',
            x: 26,
            y: -3,
            w: 18,
            src: ekosistemaSmeshanniiLes.derevya.beryoza2Lisaya,
            ClickableMaskSVG: beryoza2Lisaya,
            type: ForestMemberType.BirchBig,
        },
        {
            name: 'trutovik',
            x: 32.8,
            y: 47,
            w: 2.5,
            src: ekosistemaSmeshanniiLes.rasteniya.trutovik,
            type: ForestMemberType.PolyPore,
        },
        {
            name: 'yel',
            x: 57,
            y: -30,
            w: 28,
            src: ekosistemaSmeshanniiLes.derevya.yel,
            ClickableMaskSVG: yel,
            type: ForestMemberType.FirBig,
        }
    ];

    const preparedObjects = objects.map((obj) => {
        if (!obj.type || !availableMembersMap[obj.type] || !isClickable) {
            obj.isUnclickable = true;
        } else {
            obj.onClick = () => onMemberClick(obj.type as ForestMemberType);

            if (selectedMembers.includes(obj.type)) {
                obj.isActive = true;
            } else {
                obj.isActive = false;
            }
        }

        if (
            obj.type
            && isSelectionHighlighted
            && !isClickable
            && selectedMembers.includes(obj.type)
        ) {
            obj.isActive = true;
        }

        if (
            obj.type
            && showSelectionError
            && selectedMembers.includes(obj.type)
        ) {
            obj.isError = true;
        } else {
            obj.isError = false;
        }

        return obj;
    });

    return preparedObjects;
};
