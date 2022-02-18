import React, {useState} from 'react';
import styled from '@emotion/styled';
import {NavLink} from 'react-router-dom';
import {Clickable} from '@/components/clickable';
import {ReactNode} from 'react';
import {GlyphType} from '@/components/icon/glyphs';
import {css, useTheme} from '@emotion/react';
import Icon from '@/components/icon';

export const SubMenu = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: column;
`;

export const SubmenuNavLink = styled(NavLink)`
  display: block;
  white-space: nowrap;
  cursor: pointer;
  padding: 16px;
  color: ${(p) => p.theme.colors.grayscale.body};
  font-weight: bold;
  border-radius: 6px;
  
  transition: all .2s ease-in-out;
  
  &:hover {
    background-color: ${(p) => p.theme.colors.primary.light};
  }
  
  .active {
    color: ${(p) => p.theme.colors.primary.default};
  }
`;

export const SubMenuActions = styled.div`
  display: flex;
`;

type TreeItemAction = {
    icon: GlyphType,
    iconColor: string,
    color?: string,
    onClick: () => void,
}

type TreeItemProps = {
    expand?: boolean,
    onClick?: () => void,
    actions?: TreeItemAction[],
    title: string,
    children?: ReactNode,
    depth?: number,
    className?: string,
}

export const MenuItem = ({
    expand,
    title,
    onClick,
    actions,
    children,
    depth = 0,
    className,
}: TreeItemProps) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(expand);

    const actionStyles = `
          display: inline-block;
          margin-right: 16px;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          display: flex;
    `;

    return (
        <div
            className={className}
            css={css`
                margin-left: ${depth * 16}px;
                
                .expand-icon {
                  margin-left: 8px;
                }
              
                .tree-item-head {
                  display: flex;
                  white-space: nowrap;
                  align-items: center;
                  
                  &:hover {
                    .tree-item-actions {
                      opacity: 1;
                    }
                  }
                }
                
                .tree-item-title {
                  display: flex;
                  padding: 16px;
                  color: ${theme.colors.grayscale.body};
                  font-weight: bold;
                  border-radius: 6px;
                  margin-right: 16px;

                  &:hover {
                    background-color: ${theme.colors.primary.light};
                  }
                }
                
                .tree-item-actions {
                  display: flex;
                  opacity: 0;
                }
            `}
        >
            <div className='tree-item-head'>
                <Clickable
                    className='tree-item-title'
                    onClick={children ? () => setExpanded((old) => !old) : onClick}
                >
                    <div>
                        {title}
                    </div>

                    {children &&
                        <Icon
                            className='expand-icon'
                            size={16}
                            glyph={expanded ? 'ArrowChevronDown' : 'ArrowChevronForward'}
                            color={theme.colors.grayscale.body}
                        />
                    }
                </Clickable>

                <div className='tree-item-actions'>
                    {actions?.map((action) => (
                        <Clickable
                            key={action.icon}
                            onClick={action.onClick}
                            css={css`
                          ${actionStyles};
                          border: 2px solid ${action.iconColor};
                          background-color: ${action.iconColor};
                          
                          &:hover {
                            background-color: ${action.iconColor};
                          }
                        `}
                            style={{borderColor: action.iconColor}}
                        >
                            <Icon size={16} glyph={action.icon} color="white" />
                        </Clickable>
                    ))}
                </div>

            </div>
            {expanded && children}
        </div>
    );
};
