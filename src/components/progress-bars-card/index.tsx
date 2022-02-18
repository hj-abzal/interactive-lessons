import React, {useEffect, useState} from 'react';
import {css} from '@emotion/react';
import Card from '../card';
import CornerWrapper from '../corner-wrapper';
import ProgressBar, {ProgressBarProps} from '../progress-bar';
import Space from '../space';

export const ProgressBarsCard = ({scales, title, isHidden, isShiftOnHover}: {
        scales: ProgressBarProps[];
        title: string;
        isHidden: boolean;
        isShiftOnHover?: boolean;
    }) => {
    const [isMouseOver, setIsMouseOver] = useState(false);

    useEffect(() => {
        if (isMouseOver) {
            setTimeout(() => {
                setIsMouseOver(false);
            }, 3000);
        }
    }, [isMouseOver]);

    return (
        <CornerWrapper
            onMouseOver={() => isShiftOnHover && setIsMouseOver(true)}
            css={css`
                ${isHidden && css`
                    transform: scale(0.9) translateX(100px);
                    opacity: 0;
                    pointer-events: none;
                `}
                pointer-events: ${isMouseOver ? 'none' : 'all'};
            `}
            position='top-right'
        >
            <Card
                padding={'20px 32px 16px 32px'}
                width={380}
                css={css`
                    pointer-events: none;
                    transition: 0.4s ease-in-out;
                    transform: scale(1) translate(0);
                    opacity: ${isMouseOver ? 0.1 : 1};
                    ${isShiftOnHover && css`
                        backdrop-filter: blur(3px);
                        background: rgb(255 255 255 / 80%);
                    `}
                `}
            >
                <h4>{title}</h4>
                <Space size={16} />
                {Array.isArray(scales) &&
                    scales.map((scale) =>
                        <ProgressBar key={scale.label} {...scale} />)}
            </Card>
        </CornerWrapper>
    );
};
