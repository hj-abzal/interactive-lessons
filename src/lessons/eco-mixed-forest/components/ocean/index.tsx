import React, {useMemo} from 'react';
import {StyledRoot} from '@/lessons/eco-mixed-forest/components/ocean/css';
import InteractiveParallax from '@/components/interactive-parallax';
import {layersData} from '@/lessons/eco-mixed-forest/components/ocean/layers';
import {AvailableMembersMap, MemberType} from '@/lessons/eco-mixed-forest/context/types';
import {createObjects} from '@/lessons/eco-mixed-forest/components/ocean/objects';
export type Props = {
    availableMembersMap: AvailableMembersMap,
    targetMembers: {
        [key in MemberType]?: boolean
    },
    onMemberClick: (type: MemberType) => void,
    selectedMembers: MemberType[],
    isClickable: boolean,
    showSelectionError?: boolean,
    isSelectionHighlighted?: boolean,
};

export const Ocean = ({
    availableMembersMap,
    targetMembers,
    onMemberClick,
    selectedMembers,
    isClickable,
    showSelectionError,
    isSelectionHighlighted,
}: Props) => {
    const preparedObjects = useMemo(() => createObjects({
        availableMembersMap,
        isClickable,
        targetMembers,
        onMemberClick,
        selectedMembers,
        showSelectionError,
        isSelectionHighlighted,
    }), [
        availableMembersMap,
        targetMembers,
        selectedMembers,
        onMemberClick,
        isClickable,
        showSelectionError,
        isSelectionHighlighted
    ]);
    return (
        <StyledRoot>
            <InteractiveParallax
                layersData={layersData}
                objectsData={preparedObjects}
                sceneParams={{
                    parallaxFactor: 0,
                }}
            />
        </StyledRoot>
    );
};
