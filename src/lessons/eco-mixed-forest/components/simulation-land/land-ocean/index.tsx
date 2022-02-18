import React from 'react';
import {css} from '@emotion/react';
import {CoordsEditor} from '@/components/coords-editor/coords-editor';
import {MemberItem, membersPositions} from '@/lessons/eco-mixed-forest/components/simulation-land/config';
import {LandMember} from '@/lessons/eco-mixed-forest/components/simulation-land/land-member';
import {MemberType} from '@/lessons/eco-mixed-forest/context/types';
import ekosistemaOtkritiiOkean from '@/codgen/ekosistemaOtkritiiOkean';

export type Props = {
    members: MemberItem[],
    membersPair: {
        first: MemberType,
        second: MemberType,
    },
};

export const SimulationLandOcean = ({
    members,
    membersPair,
}: Props) => {
    return (
        <div css={css`
                position: relative;
                .simulation-land-cover-image{
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    background-image: url(${ekosistemaOtkritiiOkean.ostrov.poverkh});
                    width: 700px;
                    height: 700px;
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: contain;
                }
                .simulation-land-members {
                    position: absolute;
                    top: 175px;
                    right: 0;
                    left: -15px;
                    bottom: 0;
                  }
                .simulation-land-image {
                    background-image: url(${ekosistemaOtkritiiOkean.ostrov.fon});
                    width: 700px;
                    height: 700px;
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: contain;
                }
            `}
        >
            <div className='simulation-land-cover-image' />
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
