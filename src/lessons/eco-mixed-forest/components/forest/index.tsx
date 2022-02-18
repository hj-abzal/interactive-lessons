import React, {useMemo} from 'react';

import {StyledRoot} from '@/lessons/eco-mixed-forest/components/forest/css';

import {layersData} from '@/lessons/eco-mixed-forest/components/forest/layers';
import {createObjects} from '@/lessons/eco-mixed-forest/components/forest/objects';

import InteractiveParallax from '@/components/interactive-parallax';
import {AvailableMembersMap, MemberType} from '@/lessons/eco-mixed-forest/context/types';

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

export const Forest = ({
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
