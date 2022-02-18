import Card from '@/components/card';
import {ConstructorScenarioContextType} from '@/context-providers/constructor-scenario';
import {css, useTheme} from '@emotion/react';
import classNames from 'classnames';
import {uniq} from 'lodash';
import React, {useEffect, useState} from 'react';

export type OverlayStagesNavProps = {
    state: ConstructorScenarioContextType['state'];
    setCurrentStage: (s: string) => void;
}

export const OverlayStagesNav = (p: OverlayStagesNavProps) => {
    const [currentActiveIndex, setCurrentActiveIndex] = useState<number>(0);
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [isTabPressed, setIsShiftPressed] = useState<boolean>(false);
    const [stagesIds, setStagesIds] = useState<string[]>([]);
    const theme = useTheme();
    const modifierKeys = p.state.constructor.modifierKeys;
    const stagesHistory = p.state.constructor.stagesHistory;

    useEffect(() => {
        const availableStagesIds = Object.keys(p.state.stages);
        setStagesIds(uniq(stagesHistory.concat(availableStagesIds).filter(Boolean)));
    }, [stagesHistory, p.state.stages]);

    const setActiveIndex = (offset) => {
        const preFinalIndex = currentActiveIndex + offset;
        if (preFinalIndex >= stagesIds.length - 1) {
            setCurrentActiveIndex(stagesIds.length - 1);
            return;
        } else if (preFinalIndex <= 0) {
            setCurrentActiveIndex(0);
            return;
        } else {
            setCurrentActiveIndex(preFinalIndex);
            return;
        }
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Tab') {
            event.preventDefault();
            setIsShiftPressed(true);
        }
    };

    const onKeyUp = (event: KeyboardEvent) => {
        if (event.code === 'Tab') {
            event.preventDefault();
            setIsShiftPressed(false);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    useEffect(() => {
        if (modifierKeys.ctrlKey || modifierKeys.altKey) {
            if (isTabPressed) {
                setIsOpened(true);
                if (!modifierKeys.shiftKey) {
                    setActiveIndex(+1);
                } else {
                    setActiveIndex(-1);
                }
            }
        } else {
            if (isOpened) {
                setIsOpened(false);
                p.setCurrentStage(stagesIds[currentActiveIndex]);
                setCurrentActiveIndex(0);
            }
        }
    }, [modifierKeys.altKey, modifierKeys.ctrlKey, modifierKeys.shiftKey, isTabPressed]);

    return (isOpened ? (
        <div css={css`
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 10000;
            top: 0;
            left: 0;
            display: flex;
            align-items: flex-start;
            justify-content: center;

            .card {
                max-height: calc(100% - 20px);
                margin: 10px;
                padding: 4px;
                border-radius: 20px;
                ${theme.shadows.largeDark};
                overflow: auto;
            }

            .stage {
                width: 100%;
                padding: 18px 24px;
                background-color: transparent;
                border-radius: 16px;
                &.active {
                    background-color: ${theme.colors.primary.light};
                }
            }
        `}>
            <Card className="card">
                {stagesIds.map((stage, index) =>
                    <div key={stage}
                        className={classNames({
                            stage: true,
                            active: currentActiveIndex === index,
                        })} >
                        {stage}
                    </div>)}
            </Card>
        </div>) : <></>
    );
};
