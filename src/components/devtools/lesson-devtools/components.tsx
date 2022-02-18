import React, {ReactNode} from 'react';
import ReactDOM from 'react-dom';
import {DEVTOOLS_CONTENT_PORTAL_ID} from '@/components/devtools/lesson-devtools/index';
import {css, useTheme} from '@emotion/react';
import {Clickable} from '@/components/clickable';
import styled from '@emotion/styled';

export type DevtoolsContentPortalProps = {
    children: ReactNode,
}

export const DevtoolsContentPortal = ({
    children,
}: DevtoolsContentPortalProps) => {
    return ReactDOM.createPortal(
        children,
        document.getElementById(DEVTOOLS_CONTENT_PORTAL_ID) || document.createElement('div')
    );
};

export type DevtoolListItem = {
    text?: string,
    onClick?: () => void,
}

export const DevtoolsSection = styled.div`
  margin-right: 15px;
`;

export type DevtoolsListProps = {
    title?: string,
    items?: DevtoolListItem[],
};

export const DevtoolsList = ({
    title,
    items,
}: DevtoolsListProps) => {
    const theme = useTheme();

    return (
        <div
            css={css`
              display: flex;
              flex-direction: column;
  
               .section-title {
                  font-weight: bold;
                }
                
                .section-item {
                  margin-top: 5px;
                }
                
                .devtool-item-button {
                  color: ${theme.colors.primary.default};
                  display: block;
                  font-weight: bold;
                }
        `}
        >
            {title &&
             <div className="section-title">{title}</div>
            }

            {items?.map((item, i) => (
                item.onClick
                    ? (
                        <div key={i} className='section-item'>
                            <Clickable
                                className="devtool-item-button"
                                onClick={item.onClick}
                            >
                                {item.text}
                            </Clickable>
                        </div>
                    )
                    : (
                        <div key={i} className='section-item'>{item.text}</div>
                    )
            ))}
        </div>
    );
};
