import React from 'react';
import {css, SerializedStyles} from '@emotion/react';
import cl from 'classnames';
import {MemberItem} from '@/lessons/eco-mixed-forest/components/simulation-land/config';
import {BiosphereType, ForestMemberType, MemberType, OceanMemberType} from '@/lessons/eco-mixed-forest/context/types';
import ekosistemaSmeshanniiLes from '@/codgen/ekosistemaSmeshanniiLes';
import ekosistemaOtkritiiOkean from '@/codgen/ekosistemaOtkritiiOkean';
import {getBiosphereTypeByMemberType} from '@/lessons/eco-mixed-forest/context/utils';

type MemberImages = {
    [key: string]: {
        src: string,
        css?: SerializedStyles
    }
}

export const memberImages: MemberImages = {
    [ForestMemberType.Fox]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.lisa,
    },
    [ForestMemberType.Wolf]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.volk,
    },
    [ForestMemberType.Frog]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.lyagushka,
    },
    [ForestMemberType.Snake]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.zmeya,
    },
    [ForestMemberType.Hare]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.zayats,
    },
    [ForestMemberType.Squirrel]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.belka,
    },
    [ForestMemberType.Fir]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.yel,
    },
    [ForestMemberType.FirBig]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.yel,
    },
    [ForestMemberType.FirSmall]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.yel,
        css: css`
            transform: scale(0.5);
        `,
    },
    [ForestMemberType.Birch]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.berezaMalaya,
        css: css`
            transform: scale(1.3);
        `,
    },
    [ForestMemberType.BirchBig]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.berezaMalaya,
        css: css`
            transform: scale(1.3);
        `,
    },
    [ForestMemberType.BirchSmall]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.berezaMalaya,
        css: css`
            transform: scale(0.7);
        `,
    },
    [ForestMemberType.PolyPore]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.trutovik,
    },
    [ForestMemberType.Mushroom]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.grib,
    },
    [ForestMemberType.Grass]: {
        src: ekosistemaSmeshanniiLes.rasteniya.trava1,
    },
    [OceanMemberType.Acorns]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.morskoiZhyolud,
        css: css`
            transform: scale(0.6);
        `,
    },
    [OceanMemberType.Actinia]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.aktiniya,
    },
    [OceanMemberType.HermitCrab]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.rakotshelnik,
    },
    [OceanMemberType.KillerWhale]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.kosatka,
    },
    [OceanMemberType.Lamprey]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.minoga, // minoga нету css
    },
    [OceanMemberType.Perch]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.okun,
    },
    [OceanMemberType.Shark]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.akula,
    },
    [OceanMemberType.Suckerfish]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.prilipala,
    },
    [OceanMemberType.Whale]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.kit,
        css: css`
            transform: scale(1.2);
        `,
    },
};

export type Props = {
    member: MemberItem,
    membersPair: {
        first: MemberType,
        second: MemberType,
    },
}

export const LandMember = ({
    member,
    membersPair,
}: Props) => {
    // @ts-ignore
    const isFirst = member.memberType === membersPair.first;
    const isSecond = member.memberType === membersPair.second;
    const biosphereType = member.memberType
        ? getBiosphereTypeByMemberType(member.memberType)
        : BiosphereType.Forest;

    return (
        <div
            css={css`
              position: absolute;
              width: 60px;
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
              top: ${member.y}px;
              left: ${member.x}px;

              .land-member {
                transition: all .4s ease-in-out;
                position: absolute;
                top: 0;
                left: 0;
                width: ${biosphereType === BiosphereType.Ocean ? 54 : 60}px;
                height: ${biosphereType === BiosphereType.Ocean ? 54 : 60}px;
                opacity: 0;
                
                &.land-member-second {
                 transform: translateY(-16px) translateX(25px) scale(0);
                  
                  &.land-member--visible {
                       opacity: 1;
                       transform: translateY(-16px) translateX(25px) scale(1.2);
                  }
                }
                
                 &.land-member-first {
                       transform: translateY(-16px) translateX(25px) scale(0) scaleX(-1);
                      
                      &.land-member--visible {
                           opacity: 1;
                           transform: translateY(-16px) translateX(25px) scale(1.2) scaleX(-1);
                      }
                }
                
                
                img {
                  width: 60px;
                  height: 60px;
                }

                &.land-member--visible {
                   opacity: 1;
                   transform: translateY(-16px) translateX(25px) scale(1);
                }
              }
            `}
            key={member.id}
        >
            <div
                className={cl({
                    'land-member': true,
                    'land-member--visible': isFirst,
                    'land-member-first': true,
                })}
            >
                <img css={memberImages[membersPair.first]?.css} src={memberImages[membersPair.first].src} />
            </div>
            <div
                className={cl({
                    'land-member': true,
                    'land-member--visible': isSecond,
                    'land-member-second': true,
                })}
            >
                <img css={memberImages[membersPair.second].css} src={memberImages[membersPair.second].src} />
            </div>
        </div>
    );
};
