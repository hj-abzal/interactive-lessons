import React from 'react';
import {WidgetProps} from './index';
import {Controller} from 'react-hook-form';
import styled from '@emotion/styled';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import TextareaAutosize from 'react-textarea-autosize';
import Icon from '@/components/icon';
import classNames from 'classnames';

const StyledTextArea = styled(TextareaAutosize)`
  width: 100%;
  min-height: 25px;
  max-height: 200px;
  resize: none;
  &::placeholder{
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const TextAreaComponent = ({
    isTableRowMode,
    icon,
    label,
    defaultValue,
    placeholder,
    onChange,
    value,
    isDisabled,
    isHidden,
    ...field
}: any) => (
    <label>
        <StyledWrapper
            css={(!value && !isTableRowMode) && OnCollapsedStyles}
            className={classNames({
                disabled: isDisabled,
                hidden: isHidden,
            })}
        >
            <Icon size={16} glyph={icon} />
            {!isTableRowMode && label}
            <div className="wrapper">
                <StyledTextArea
                    disabled={isDisabled}
                    placeholder={placeholder || defaultValue || ''}
                    onChange={onChange}
                    value={value}
                    {...field}
                />
            </div>
        </StyledWrapper>
    </label>
);

const TextArea: React.FC<any> = ({params, control}:WidgetProps) => {
    return (
        <Controller
            render={({field}) => {
                return <TextAreaComponent
                    {...params}
                    {...field}
                />;
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};
export default TextArea;
