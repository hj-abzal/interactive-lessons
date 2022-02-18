import React from 'react';
import {WidgetProps} from './index';
import {Controller} from 'react-hook-form';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import Icon from '@/components/icon';
import {DataEditor} from '@/components/data-editor';
import styled from '@emotion/styled';
import classNames from 'classnames';

const EditorWrapper = styled.div`
    margin-left: -24px;
    & > .svelte-jsoneditor-react{
        height: auto !important;
        .jsoneditor-main {
            border-radius: 4px !important;
            height: auto !important;
            min-height: 25px !important;
        }
        .contents, .tree-mode {
            background: transparent !important;
        }
        .welcome {
            display: none !important;
        }
    }
`;

const DataInput: React.FC<any> = ({params, control}:WidgetProps) => {
    return (
        <Controller
            render={({field}) => {
                return (<label>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}
                    css={(!field.value && !params.isTableRowMode) && OnCollapsedStyles}>
                        <Icon size={16} glyph={params.icon} />
                        {!params.isTableRowMode && params.label}
                        <EditorWrapper className="wrapper">
                            {!params.isDisabled && <DataEditor
                                {...{...field, ref: undefined}}
                                isNavigationBarHidden
                                isMenuBarHidden
                                isInitiallyCollapsed
                            />}
                        </EditorWrapper>
                    </StyledWrapper>
                </label>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};
export default DataInput;
