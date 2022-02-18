import React from 'react';
import {WidgetProps} from './index';
import {Controller} from 'react-hook-form';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import Icon from '@/components/icon';
import {default as SliderComponent} from 'react-input-slider';
import {css, useTheme} from '@emotion/react';
import classNames from 'classnames';

export const checkIsNoCoords = (val) => !val
|| (typeof val.x !== 'number'
    && typeof val.y !== 'number');

const CoordsInput: React.FC<any> = ({params, control}:WidgetProps) => {
    const theme = useTheme();
    return (
        <Controller
            render={({field}) => {
                const isNoValue = checkIsNoCoords(field.value);
                return (<label onClick={() => isNoValue && field.onChange({x: 50, y: 50})}>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}
                    css={(
                        isNoValue
                        && !params.isTableRowMode)
                        && OnCollapsedStyles}
                    >
                        <Icon size={16} glyph={params.icon} />
                        {!params.isTableRowMode && params.label}
                        <div className="wrapper">
                            {!isNoValue && <SliderComponent
                                {...field}
                                axis="xy"
                                x={field.value.x}
                                y={field.value.y}
                                xmin={0}
                                xmax={100}
                                ymin={0}
                                ymax={100}
                                styles={{
                                    track: {
                                        backgroundColor: theme.colors.grayscale.input,
                                        borderRadius: 4,
                                        width: '100%',
                                        border: '2px solid ' + theme.colors.grayscale.line,
                                    },
                                    active: {
                                        backgroundColor: theme.colors.primary.default,
                                    },
                                    thumb: css`
                                        background-color: ${theme.colors.primary.default};
                                        position: relative;
                                        display: block;
                                        content: "";
                                        width: 24px;
                                        height: 24px;
                                        border-radius: 50%;
                                        user-select: none;
                                        cursor: pointer;
                                        box-sizing: border-box;
                                        transition: 0.3s ease;
                                        ${theme.shadows.small};
                                        &::after {
                                            content: "";
                                            position: absolute;
                                            top: 0;
                                            right: 0;
                                            bottom: 0;
                                            left: 0;
                                            border-radius: 50%;
                                            transition: 0.3s ease;
                                            background-color: ${theme.colors.primary.default};
                                            opacity: 0;
                                        }
                                        &:hover {
                                            background-color: ${theme.colors.primary.dark};
                                            &::after {
                                                opacity: 0.1;
                                                transform: scale(1.5);
                                            }
                                        }
                                    `,
                                }}
                            />}

                            <div
                                css={css`
                                    position: absolute;
                                    top: 8px;
                                    right: 8px;
                                    cursor: pointer;
                                `}
                                onClick={() => field.onChange({x: null, y: null})}
                            >
                                <Icon size={20} glyph='CloseXBold' color={theme.colors.grayscale.placeholder} />
                            </div>
                        </div>
                    </StyledWrapper>
                </label>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};
export default CoordsInput;
