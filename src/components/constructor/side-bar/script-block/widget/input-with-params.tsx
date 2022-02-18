import {css, useTheme} from '@emotion/react';
import React, {useState} from 'react';
import {Clickable} from '@/components/clickable';
import Icon from '@/components/icon';
import {BindStageParamInput} from '@/components/constructor/side-bar/script-block/widget/bind-stage-param-input';
import {components, WidgetProps} from '@/components/constructor/side-bar/script-block/widget/index';

export const InputWithParams = ({
    type,
    bindInputToStageParam,
    availableParamsToBind,
    boundStageParam,
    getSubstate,
    params,
    control,
    rules,
    addValueToState,
    isDirty,
    isValid,
    clearError,
    error,
    register,
}: WidgetProps) => {
    const theme = useTheme();
    const [isParamBindingView, setIsParamBindingView] = useState(Boolean(boundStageParam));

    const InputComponent = components[type];

    const onBindLinkClick = () => {
        if (boundStageParam && isParamBindingView && bindInputToStageParam) {
            bindInputToStageParam({inputName: params.name, paramName: undefined});
        }

        setIsParamBindingView((old) => !old);
    };

    return (
        <div
            css={css`
              position: relative;
              margin-bottom: 4px;
              
              .bound-input-label-container {
                display: flex;
                padding-left: 8px
              }

              .bound-input-icon {
                margin-right: 4px
              }
              
              .bound-input-label {
                font-weight: bold;
                color: ${theme.colors.orange.default};
              }
              
              .original-input-container {
                display: flex;
                align-items: center;
              }
              
              .original-input {
                width: 100%;
              }
              
              ${isParamBindingView && css`
                border-left: 4px solid ${theme.colors.orange.default};
              `}
            `}
        >
            {isParamBindingView && (
                <Clickable className="bound-input-label-container" onClick={onBindLinkClick}>
                    <Icon
                        className={'bound-input-icon'}
                        glyph={params.icon}
                        color={theme.colors.orange.default}
                        size={16}
                    />
                    <div className="bound-input-label">
                        {params.label}
                    </div>
                </Clickable>
            )}

            {isParamBindingView
                ? (
                    <div className="original-input-container">
                        <div className="original-input">
                            <BindStageParamInput
                                inputType={type}
                                inputName={params.name}
                                bindInputToStageParam={bindInputToStageParam!}
                                availableParamsToBind={availableParamsToBind!}
                                boundStageParam={boundStageParam}
                                inputLabel={params.label}
                                getSubstate={getSubstate}
                            />
                        </div>

                        <Clickable
                            className={'bind-param-button'}
                            onClick={onBindLinkClick}
                        >
                            <Icon
                                glyph={'LinkBound'}
                                color={theme.colors.orange.default}
                                size={16}
                            />
                        </Clickable>
                    </div>
                )
                : (
                    <div className="original-input-container">
                        <div className="original-input">
                            <InputComponent
                                {...({register} as any)}
                                control={control}
                                rules={rules}
                                getSubstate={getSubstate}
                                addValueToState={addValueToState}
                                clearError={clearError}
                                error={error}
                                isValid={isValid}
                                isDirty={isDirty}
                                params={params}
                                inputComponents={components}
                            />
                        </div>

                        <Clickable
                            className={'bind-param-button'}
                            onClick={onBindLinkClick}
                        >
                            <Icon
                                glyph={'LinkUnbound'}
                                color={theme.colors.primary.default}
                                size={16}
                            />
                        </Clickable>
                    </div>
                )
            }

        </div>
    );
};
