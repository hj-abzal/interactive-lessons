import {
    BiosphereType,
    MemberRelation,
    MemberType, OceanMemberType,
    RelationType, RoleMark,
    SubRelationType
} from '@/lessons/eco-mixed-forest/context/types';
import {allForestMembers} from '@/lessons/eco-mixed-forest/context/tasks-config';

export const isMemberTypeRelevant = (memberType: MemberType, memberRelation: MemberRelation) => {
    if (memberRelation.memberTypeVariants) {
        return memberRelation.memberTypeVariants.some((type) => type === memberType);
    } else {
        return memberType === memberRelation.memberType;
    }
};

export const getBiosphereTypeByMemberType = (memberType: MemberType) => {
    if (Object.values(OceanMemberType).includes(memberType as OceanMemberType)) {
        return BiosphereType.Ocean;
    }

    return BiosphereType.Forest;
};

export const createNeutralismTask = (firstMemberType: MemberType, secondMemberType: MemberType) => ({
    name: `${firstMemberType}-${secondMemberType}`,
    members: allForestMembers,
    relationType: RelationType.Neutralism,
    targetPair: {
        first: {
            memberType: firstMemberType,
            subRelationType: SubRelationType.Nothing,
            roleMark: RoleMark.Zero,
        },
        second: {
            memberType: secondMemberType,
            subRelationType: SubRelationType.Nothing,
            roleMark: RoleMark.Zero,
        },
    },
});
