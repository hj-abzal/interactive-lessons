import React, {useMemo} from 'react';
import {membersPositions} from '@/lessons/eco-mixed-forest/components/simulation-land/config';
import {BiosphereType, MemberType} from '@/lessons/eco-mixed-forest/context/types';
import {SimulationLandOcean} from '@/lessons/eco-mixed-forest/components/simulation-land/land-ocean/index';
import {SimulationLandForest} from '@/lessons/eco-mixed-forest/components/simulation-land/land-forest/index';
import {getBiosphereTypeByMemberType} from '@/lessons/eco-mixed-forest/context/utils';

export type Props = {
    membersPopulation: {
        first: number,
        second: number,
    },
    membersPair: {
        first: MemberType,
        second: MemberType,
    },
};

export const SimulationLand = ({
    membersPair,
    membersPopulation,
}: Props) => {
    const biosphereType = getBiosphereTypeByMemberType(membersPair.first);

    const members = useMemo(() => {
        const result = membersPositions.map((x) => ({...x}));

        const half = Math.round(membersPositions.length / 2);

        for (let i = 0; i <= Math.min(membersPopulation.first, half); i++) {
            result[i].memberType = membersPair.first;
        }

        for (let i = half; i <= Math.min(half + membersPopulation.second, membersPositions.length - 1); i++) {
            result[i].memberType = membersPair.second;
        }

        return result;
    }, [membersPair, membersPopulation.first, membersPopulation.second]);

    if (biosphereType === BiosphereType.Ocean) {
        return <SimulationLandOcean members={members} membersPair={membersPair}/>;
    }

    return <SimulationLandForest members={members} membersPair={membersPair}/>;
};
