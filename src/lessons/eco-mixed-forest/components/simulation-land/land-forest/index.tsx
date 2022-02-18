import React from 'react';
import {css} from '@emotion/react';
import {CoordsEditor} from '@/components/coords-editor/coords-editor';
import {MemberItem, membersPositions} from '@/lessons/eco-mixed-forest/components/simulation-land/config';
import {LandMember} from '@/lessons/eco-mixed-forest/components/simulation-land/land-member';
import {MemberType} from '@/lessons/eco-mixed-forest/context/types';
import ekosistemaSmeshanniiLes from '@/codgen/ekosistemaSmeshanniiLes';

export type Props = {
    members: MemberItem[],
    membersPair: {
        first: MemberType,
        second: MemberType,
    },
};

export const SimulationLandForest = ({
    members,
    membersPair,
}: Props) => {
    return (
        <div css={css`
            position: relative;
            .simulation-land-members {
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                bottom: 0;
              }
            .simulation-land-image {
                background-image: url(${ekosistemaSmeshanniiLes.ostrov});
                width: 697px;
                height: 597px;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: contain;
            }
        `}
        >
            <div className="simulation-land-members">
                <CoordsEditor
                    off={true}
                    initialMarks={membersPositions}
                    markHeight={60}
                    markWidth={60}
                    xPositionError={-20}
                />

                {members.map((member, i) => (
                    <LandMember membersPair={membersPair} key={i} member={member}/>
                ))}
            </div>
            <div className='simulation-land-image' />
        </div>
    );
};
