import React from 'react';
import {css} from '@emotion/react';
import classNames from 'classnames';

export const GolubVisionOverlay = ({active}: {active?: boolean}) => (
    <div
        className={classNames({active})}
        css={css`
        width: 100%;
        height: 100%;
        position: absolute;
        pointer-events: none;
        overflow: hidden;
        .blur-area {
            border-radius: 100%;
            top: -20%;
            bottom: -20%;
            left: 30%;
            right: 30%;
            background-color: transparent;
            position: absolute;
            backdrop-filter: blur(8px) grayscale(0.6);
            mask-image: radial-gradient(black 34%, transparent 75%, transparent 100%);
            opacity: 0;
            transition: 1s ease;
        }
        .top, .bottom {
            position: absolute;
            left: 0;
            right: 0;
            background-color: #9edbf2;
            height: 20%;
            transition: 1s ease;
        }
        .top {
            top: 0;
            transform: translateY(-100%);
        }
        .bottom {
            bottom: 0;
            transform: translateY(100%);
        }
        &.active {
            .top, .bottom {
                transform: translateY(0);
            }
            .blur-area {
                opacity: 1;
            }
        }

    `}>
        <div className="blur-area"></div>
        <div className="top"></div>
        <div className="bottom"></div>
    </div>
);

export const HeronVisionOverlay = ({active}: {active?: boolean}) => (
    <div
        className={classNames({active})}
        css={css`
        width: 100%;
        height: 100%;
        position: absolute;
        pointer-events: none;
        overflow: hidden;
        .viewFromLeft, .viewFromRight {
            position: absolute;
            left: 0;
            right: 0;
            background-color: #9edbf2;
            height: 100%;
            transition: 1s ease;
        }
        .viewFromLeft {
            top: 0;
            transform: translateX(100%);
        }
        .viewFromRight {
            bottom: 0;
            transform: translateX(-100%);
        }
        &.active {
            .viewFromLeft {
                transform: translateX(70%);
            }
            .viewFromRight {
                transform: translateX(-70%);
            }
        }

    `}>
        <div className="viewFromLeft"></div>
        <div className="viewFromRight"></div>
    </div>
);
