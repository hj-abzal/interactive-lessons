import React, {useCallback, useEffect, useRef, useState} from 'react';
import {css, useTheme} from '@emotion/react';
import {NavLink} from 'react-router-dom';
import Icon, {IconProps} from '../icon';
import {Clickable} from '@/components/clickable';
import {useClickOutside} from '@/utils/use-click-outside';

export type NavItemProps = {
    isDark?: boolean;
    icon?: IconProps['glyph'];
    label: string;
    onClick?: () => void;
    to?: string;
    onHoverMenuContent?: React.ReactNode;
};

// eslint-disable-next-line react/display-name
const NavItem = React.memo((p: NavItemProps) => {
    const theme = useTheme();

    const [active, setActive] = useState(false);
    const [menuRight, setMenuRight] = useState(0);
    const menuRef = useRef<HTMLDivElement>();
    const timeoutRef = useRef<any>();

    const onMenuMouseLeave = useCallback(() => {
        if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                setActive(false);
                timeoutRef.current = undefined;
            }, 100);
        }
    }, [setActive]);

    const onMenuMouseEnter = useCallback(() => {
        if (!active) {
            setActive(true);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
    }, []);

    useClickOutside(menuRef, () => setActive(false));

    useEffect(() => {
        if (!menuRef.current || menuRight) {
            return;
        }

        const menuRect = menuRef.current.getBoundingClientRect();

        const bodyRect = document.body.getBoundingClientRect();

        if (menuRect.width + menuRect.x > bodyRect.width) {
            setMenuRight(menuRect.width + menuRect.x - bodyRect.width + 8);
        }
    }, [menuRef.current]);

    const visibleMenuStyles = css`
            opacity: 1;
            pointer-events: all;
            transform: translateY(0);
    `;

    return (
        <div css={css`
            position: relative;

            & > .item {
                padding-right: 8px;
                padding-left: 8px;
                height: 60px;
                border-radius: 8px;
                background-color: transparent;
                transition: 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                text-decoration: none;
                color: ${theme.colors.grayscale.body};
                
                span {
                    font-size: 12px;
                    color: inherit;
                    font-weight: bold;
                    text-align: center;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    max-width: 100%;
                    overflow: hidden;
                    padding: 0 4px;
                }
                
                svg {
                    margin: 6px;
                }
              
                &:hover {
                    background-color: ${theme.colors.primary.light};
                }
                
                 ${active && `
                     background-color: ${theme.colors.primary.light};
                `};

                &.active{
                    background-color: ${theme.colors.primary.light};
                    color: ${theme.colors.primary.default};
                }
            }

            .sub-menu-wrapper {
                position: absolute;
                top: calc(100% + 4px);
                right: 0px;
                width: 100vw;
                height: calc(100vh - 88px);
                pointer-events: none;
                overflow: hidden;
            }
            
            .sub-menu {
                position: absolute;
                display: flex;
                flex-direction: column;
                top: 0px;
                right: 0;
                transform: translateY(-10%);
                padding: 10px;
                border-radius: 0 0 8px 8px;
                transition: 0.1s ease;
                opacity: 0;
                pointer-events: none;
                background-color: ${theme.colors.grayscale.white};
                z-index: 1000;
                ${theme.shadows.medium};
                
                ${active && visibleMenuStyles}
            }

            &:hover {
                .sub-menu {
                    z-index: 1001;
                    ${visibleMenuStyles}
                }
            }
        `}>

            {p.to
                ? (
                    <NavLink
                        className='item'
                        to={p.to}
                        onClick={p.onClick}
                        onMouseEnter={onMenuMouseEnter}
                        onMouseLeave={onMenuMouseLeave}
                    >
                        {p.icon && <Icon glyph={p.icon} />}
                        <span>{p.label}</span>
                    </NavLink>
                )
                : (
                    <Clickable
                        className='item'
                        onClick={() => {
                            setActive(true);
                            p.onClick?.call(null);
                        }}
                        onMouseEnter={onMenuMouseEnter}
                        onMouseLeave={onMenuMouseLeave}
                    >
                        {p.icon && <Icon glyph={p.icon} />}
                        <span>{p.label}</span>
                    </Clickable>
                )
            }

            {active && p.onHoverMenuContent &&
                <div className="sub-menu-wrapper">
                    <div
                        // @ts-ignore
                        ref={menuRef}
                        onMouseEnter={onMenuMouseEnter}
                        onMouseLeave={onMenuMouseLeave}
                        className="sub-menu"
                    >
                        {p.onHoverMenuContent}
                    </div>
                </div>
            }

        </div>
    );
});

export default NavItem;
