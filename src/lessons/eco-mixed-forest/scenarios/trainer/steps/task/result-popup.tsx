import React from 'react';
import Card from '@/components/card';
import Button from '@/components/button';
import {css} from '@emotion/react';
export type Props = {
    isPassed: boolean,
    errorsCount: number,
    tasksCount: number,
    passedTasks: number,
    onRetry: () => void,
}

export const ResultPopup = ({
    isPassed,
    errorsCount,
    tasksCount,
    passedTasks,
    onRetry,
}: Props) => {
    return (
        <Card>
            <div css={css`
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                padding: 16px;
                max-width: 680px;
            `}>
                <h5>Твой результат: {passedTasks}/{tasksCount}</h5>
                <h5>Ошибок: {errorsCount}</h5>
                <br/>
                {isPassed
                    ? <p>Молодец! Это очень хороший результат.</p>
                    : <p>Тренажёр не пройден. Допущено много ошибок.</p>
                }
                <br/>
                <Button onClick={onRetry}>
                    Повторить
                </Button>
            </div>
        </Card>
    );
};
