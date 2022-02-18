import ekosistemaOtkritiiOkean from '@/codgen/ekosistemaOtkritiiOkean';
import {LayerObjectType} from '@/components/interactive-parallax/layer-object';
import {AvailableMembersMap, MemberType, OceanMemberType} from '@/lessons/eco-mixed-forest/context/types';

type Options = {
    availableMembersMap: AvailableMembersMap,
    targetMembers: {
        [key in OceanMemberType]?: boolean
    },
    onMemberClick: (type: MemberType) => void,
    selectedMembers: MemberType[],
    isClickable: boolean,
    showSelectionError?: boolean,
    isSelectionHighlighted?: boolean,
}

type ExtendedLayerType = LayerObjectType & {
    type?: OceanMemberType,
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
            name: 'prilipala',
            x: 24.7,
            y: 7.5,
            w: 4.9,
            type: OceanMemberType.Suckerfish,
            src: ekosistemaOtkritiiOkean.prilipala,
            isSmallObject: true,
        },
        {
            name: 'kit',
            x: 47.75,
            y: -3.7,
            w: 74.6,
            type: OceanMemberType.Whale,
            src: ekosistemaOtkritiiOkean.kit,
            transform: 'rotateY(180deg)',
        },
        {
            name: 'akula',
            x: 17.5,
            y: 3.4,
            w: 20,
            type: OceanMemberType.Shark,
            src: ekosistemaOtkritiiOkean.akula,
        },
        {
            name: 'kosatka',
            x: 37.1,
            y: 44.6,
            w: 15.5,
            type: OceanMemberType.KillerWhale,
            src: ekosistemaOtkritiiOkean.kosatka,
        },
        {
            name: 'minoga',
            x: 51.59,
            y: 85.125,
            w: 4.9,
            type: OceanMemberType.Lamprey,
            src: ekosistemaOtkritiiOkean.minoga,
            isSmallObject: true,
        },
        {
            name: 'okun',
            x: 52.4,
            y: 78.7,
            w: 7.2,
            type: OceanMemberType.Perch,
            src: ekosistemaOtkritiiOkean.okun,
        },
        {
            name: 'aktiniya',
            x: 39.79,
            y: 86.3,
            w: 2,
            type: OceanMemberType.Actinia,
            src: ekosistemaOtkritiiOkean.aktiniya,
        },
        {
            name: 'rakotshelnik',
            x: 39.55,
            y: 90.45,
            w: 2.42,
            type: OceanMemberType.HermitCrab,
            src: ekosistemaOtkritiiOkean.rakotshelnik,
        },
        {
            name: 'zhyoludi',
            x: 70,
            y: 10,
            w: 7,
            type: OceanMemberType.Acorns,
            src: ekosistemaOtkritiiOkean.zhyoludi,
            transform: 'rotate(2.7rad)',
            isSmallObject: true,
        }
    ];

    const preparedObjects = objects.map((obj) => {
        if (!obj.type || !availableMembersMap[obj.type] || !isClickable) {
            obj.isUnclickable = true;
        } else {
            obj.onClick = () => onMemberClick(obj.type as OceanMemberType);

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
