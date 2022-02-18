import React from 'react';
import {css, useTheme} from '@emotion/react';
import {ForestMemberType, MemberType, OceanMemberType} from '@/lessons/eco-mixed-forest/context/types';
import {SelectInput, SelectProps} from '@/components/select-input';
import Button, {ButtonProps} from '@/components/button';
import ekosistemaSmeshanniiLes from '@/codgen/ekosistemaSmeshanniiLes';
import CornerWrapper from '@/components/corner-wrapper';
import Card from '@/components/card';
import ekosistemaOtkritiiOkean from '@/codgen/ekosistemaOtkritiiOkean';

export type SelectorProps = SelectProps & {
    title?: string,
    hidden: boolean,
}

export type ActionButtonProps = ButtonProps & {
    title?: string,
}

export type Props = {
    leftMember: MemberType,
    rightMember: MemberType,
    subtitle: string,
    title: string,
    topSelector: SelectorProps,
    bottomSelector: SelectorProps,
    actionButtonProps?: ActionButtonProps,
}

export const memberImages = {
    [ForestMemberType.Fox]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.lisa,
        css: css``,
    },
    [ForestMemberType.Wolf]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.volk,
        css: css``,
    },
    [ForestMemberType.Frog]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.lyagushka,
        css: css``,
    },
    [ForestMemberType.Snake]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.zmeya,
        css: css``,
    },
    [ForestMemberType.Hare]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.zayats,
        css: css``,
    },
    [ForestMemberType.Squirrel]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.belka,
        css: css``,
    },
    [ForestMemberType.Fir]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.yel,
        css: css``,
    },
    [ForestMemberType.FirBig]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.yel,
        css: css``,
    },
    [ForestMemberType.FirSmall]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.yel,
        css: css`
            transform: scale(0.5);
        `,
    },
    [ForestMemberType.BirchBig]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.berezaMalaya,
        css: css`
            transform: scale(1.5);
        `,
    },
    [ForestMemberType.BirchSmall]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.berezaMalaya,
        css: css`
            transform: scale(0.7);
        `,
    },
    [ForestMemberType.Birch]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.berezaMalaya,
        css: css`
            transform: scale(1.5);
        `,
    },
    [ForestMemberType.PolyPore]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.trutovik,
        css: css``,
    },
    [ForestMemberType.Mushroom]: {
        src: ekosistemaSmeshanniiLes.obektiSravneniya.grib,
        css: css``,
    },
    [ForestMemberType.Grass]: {
        src: ekosistemaSmeshanniiLes.rasteniya.trava1,
        css: css``,
    },
    [OceanMemberType.Actinia]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.aktiniya,
        css: css``,
    },
    [OceanMemberType.HermitCrab]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.rakotshelnik,
        css: css``,
    },
    [OceanMemberType.KillerWhale]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.kosatka,
        css: css``,
    },
    [OceanMemberType.Lamprey]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.minoga,
        css: css``,
    },
    [OceanMemberType.Perch]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.okun,
        css: css``,
    },
    [OceanMemberType.Shark]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.akula,
        css: css``,
    },
    [OceanMemberType.Suckerfish]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.prilipala,
        css: css``,
    },
    [OceanMemberType.Whale]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.kit,
        css: css``,
    },
    [OceanMemberType.Acorns]: {
        src: ekosistemaOtkritiiOkean.obektiSravneniya.morskoiZhyolud, //doest have css?
        css: css``,
    },
};

export const Relationship = ({
    leftMember,
    rightMember,
    title,
    subtitle,
    topSelector,
    bottomSelector,
    actionButtonProps,
}: Props) => {
    const theme = useTheme();

    return (
        <div css={css`
            display: flex;
            width: 100%;
            height: 100%;
            background-color: ${theme.colors.grayscale.background};
            
            flex-direction: column;
            align-items: center;
            
            .relationship-title {
              text-align: center;
            }
            
            .relationship-subtitle {
              text-align: center;
              margin-bottom: 8px;
              display: block;
            }
            
            .relationship-layer {
                position:absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                align-items: center;
                justify-content: space-between;
                
                &.selectors {
                    width: 250px;
                    height: 50%;
                    flex-direction: column;
                    
                    .selector-title {
                      position: absolute;
                    }
                    
                    .relationship-selector {
                      display: flex;
                      justify-content: center;
                      width: 100%;
                       ${topSelector.title && 'margin-top: -10px;'}
                    }
                }
                
                &.arrows {
                    width: 40%;
                    height: 45%;
                    flex-direction: column;
                    .relationship-arrow {
                      width: 100%;
                    }
                }
                
                &.members {
                    width: 80%;
                    flex-direction: row;
                    .relationship-member {
                      position: relative;
                      width: 40%;
                      padding-top: 40%;
                      background: url(${ekosistemaSmeshanniiLes.ui.roundBackPlate}) no-repeat center center;
                      background-size: contain;
                      
                      .inner {
                        position:absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        > img {
                            width: 60%;
                            height: 60%;
                        }
                        
                        &.second {
                          transform: scaleX(-1);
                        }
                      }
                      
                      .member-name {
                        text-align: center;
                      }
                      
                    }
                }
                
            }
        `}>

            <CornerWrapper position={'top-center'} >
                <span className="relationship-subtitle">{subtitle}</span>
                <h5 className="relationship-title">{title}</h5>
            </CornerWrapper>

            <div className="relationship-layer members">
                <div className="relationship-member">
                    <div className="inner">
                        <img
                            css={memberImages[leftMember].css}
                            src={memberImages[leftMember].src}
                        />
                    </div>
                    <h5 className="member-name">{leftMember[0].toUpperCase()}{leftMember.slice(1)}</h5>
                </div>

                <div className="relationship-member">
                    <div className="inner second">
                        <img
                            css={memberImages[rightMember].css}
                            src={memberImages[rightMember].src}
                        />
                    </div>
                    <h5 className="member-name">{rightMember[0].toUpperCase()}{rightMember.slice(1)}</h5>
                </div>
            </div>

            <div className="relationship-layer arrows">
                <img src={ekosistemaSmeshanniiLes.ui.arrow.rightBottom} className="arrow"/>
                <img src={ekosistemaSmeshanniiLes.ui.arrow.leftTop} className="arrow"/>
            </div>

            <div className="relationship-layer selectors">
                <div className='relationship-selector'>
                    {topSelector.title &&
                        <Card>
                            {topSelector.title}
                        </Card>
                    }
                    {!topSelector.hidden &&
                        <SelectInput
                            disabled={topSelector.disabled}
                            isError={topSelector.isError}
                            options={topSelector.options}
                            onChange={topSelector.onChange}
                            value={topSelector.value}
                            placeholder={topSelector.placeholder}
                        />
                    }
                </div>

                {actionButtonProps &&
                    <div className='relationship-action-button'>
                        <Button {...actionButtonProps}>
                            {actionButtonProps.title}
                        </Button>
                    </div>
                }

                <div className='relationship-selector bottom'>
                    {!bottomSelector.hidden &&
                        <SelectInput
                            disabled={bottomSelector.disabled}
                            isError={bottomSelector.isError}
                            options={bottomSelector.options}
                            onChange={bottomSelector.onChange}
                            value={bottomSelector.value}
                            placeholder={bottomSelector.placeholder}
                        />
                    }
                    {bottomSelector.title &&
                        <Card>
                            {bottomSelector.title}
                        </Card>
                    }
                </div>
            </div>

        </div>
    );
};
