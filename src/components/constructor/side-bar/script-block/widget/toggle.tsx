import React from 'react';
import {WidgetProps} from './index';
import {Controller} from 'react-hook-form';
import styled from '@emotion/styled';
import {StyledWrapper} from './common-styles';
import Icon from '@/components/icon';
import classNames from 'classnames';

const StyledToggleWrapper = styled.label`
    width: 100%;
    display: inline-block;    
    line-height: 28px;  
    margin-right: 10px;      
    position: relative;
    vertical-align: middle;
    font-size: 14px;
    user-select: none;

    > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    span {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        width: 28px;
        min-width: 28px;
        height: 16px;
        min-height: 16px !important;
        border-radius: 8px;
        vertical-align: top;
        background: ${(p) => p.theme.colors.grayscale.line};
        transition: .2s;
    }
    span:before {
        content: '';
        position: absolute;
        top: 1px;
        left: 1px;
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: white;
        transform: translateX(0);
        transition: .15s;
    }
    input[type=checkbox] {
        display: block;
        width: 0;
        height: 0;
        min-height: 0;
        position: absolute;
        z-index: -1;
        opacity: 0;
    }
    input[type=checkbox]:not(:disabled):active + span:before {
    }
    input[type=checkbox]:checked + span {
        background:${(p) => p.theme.colors.primary.default};
    }
    input[type=checkbox]:checked + span:before {
        transform:translateX(12px);
    }
    
    /* Hover */
    input[type="checkbox"]:not(:disabled) + span {
        cursor: pointer;
    }
    
    /* Disabled */
    input[type=checkbox]:disabled + span {
        filter: grayscale(70%);
    }
    input[type=checkbox]:disabled + span:before {
        background: #eee;
    }
    
    /* Focus */
    .checkbox-ios.focused span:before {
        box-shadow: inset 0px 0px 4px ${(p) => p.theme.colors.primary.default};
    }

`;

const Toggle: React.FC<any> = ({params, control}:WidgetProps) => {
    return (
        <Controller
            render={({field}) => {
                return (<StyledToggleWrapper>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}>
                        <Icon size={16} glyph={params.icon} />
                        {!params.isTableRowMode && params.label}
                        <input
                            type='checkbox'
                            checked={field.value}
                            {...field}
                            disabled={params.isDisabled}
                        />
                        <span></span>
                    </StyledWrapper>
                </StyledToggleWrapper>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};
export default Toggle;
