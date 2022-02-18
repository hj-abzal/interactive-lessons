import React, {useEffect} from 'react';
import {WidgetProps} from './index';
import {Controller} from 'react-hook-form';
import styled from '@emotion/styled';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import TextareaAutosize from 'react-textarea-autosize';
import Icon from '@/components/icon';
import classNames from 'classnames';
import {ID} from '@/utils/generate-id';

const StyledIdInput = styled(TextareaAutosize)`
  width: 100%;
  min-height: 25px;
  max-height: 200px;
  resize: none;
  &::placeholder{
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const IdInput: React.FC<any> = ({params, control}:WidgetProps) => {
    return (
        <Controller
            render={function Input({field}) {
                useEffect(() => {
                    if (params.autoGenerate && !field.value) {
                        field.onChange(ID());
                    }
                }, [field.value]);

                return (<label>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}
                    css={(!field.value && !params.isTableRowMode) && OnCollapsedStyles}
                    >
                        <Icon size={16} glyph={params.icon} />
                        {!params.isTableRowMode && params.label}
                        <div className="wrapper">
                            <StyledIdInput
                                disabled={params.isDisabled}
                                placeholder={params.placeholder || params.defaultValue || ''}
                                {...field}
                            />
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
export default IdInput;
