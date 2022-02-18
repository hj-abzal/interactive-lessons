import React from 'react';
import Button from '@/components/button';
import {css, useTheme} from '@emotion/react';

type StepperControlsProps = {
    onNext: () => void;
    onPrev: () => void;
    stepIndex: number;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
}

export const StepperControls = ({onNext, onPrev, stepIndex, isPrevDisabled, isNextDisabled}:StepperControlsProps) => {
    const theme = useTheme();
    return <div css={css`
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        padding: 8px;
        border-radius: 16px;
        background-color: ${theme.colors.transparent.light40};
        ${theme.effects.bgBlurLight};
        .step-num {
            margin: 20px;
            min-width: 28px;
            text-align: center;
        }
    `}>
        <Button size="medium" leftIcon="ArrowChevronBack" onClick={onPrev} disabled={isPrevDisabled} />
        <div className="step-num">{stepIndex}</div>
        <Button size="medium" leftIcon="ArrowChevronForward" onClick={onNext} disabled={isNextDisabled} />
    </div>;
};
