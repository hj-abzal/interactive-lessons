import React from 'react';
import {css} from '@emotion/react';
import classNames from 'classnames';
import Button from '../button';
import {ActionButtonProps} from '@/context-providers/chat';

export interface ActionProps {
    input?: ActionInputProps;
    buttons?: ActionButtonProps[];
    height?: number;
}

export type ActionInputProps = {
    label?:string;
    onType?: ()=>void;
    onSubmit?: (e:string)=>void;
}

export const Actions = React.forwardRef(function Actions(
    {buttons, height}: ActionProps,
    ref: React.Ref<HTMLDivElement>
) {
    return (
        <div
            className={classNames({
                actions: true,
                active: true,
            })}
            ref={ref}
            css={css`
                height: ${(height ? height : 0) + 'px'};
                opacity: ${height ? 1 : 0};
                transition: 0.3s ease;
                & .button-actions {
                    width: 100%;
                    padding: 0 20px;
                    display: flex;
                    flex-wrap: nowrap;
                    overflow: visible;
                    /* overflow: hidden;
                    overflow-x: auto; */
                    align-items: center;
                    & > button {
                        margin: 10px 10px 20px 0;
                        white-space: nowrap;
                    }
                }
            `}
        >
            {/* TODO: add input logic */}
            {buttons && buttons.length > 0 &&
            <div className="button-actions"> {buttons.filter((b) => !b.hidden).map((button, index) =>
                <Button key={`${button.label}-${index}`} {...button}>{button.label}</Button>)}
            </div>}

        </div>
    );
});
