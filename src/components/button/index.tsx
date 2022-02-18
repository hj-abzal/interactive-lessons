import React, {ButtonHTMLAttributes, useEffect} from 'react';
import {css, useTheme} from '@emotion/react';
import Icon from '../icon';
import Space from '../space';
import getThemes, {ButtonSizeType, ButtonThemeAppearanceType} from './themes';
import {Link} from 'react-router-dom';
import {GlyphType} from '@/components/icon/glyphs';

export interface ButtonProps {
  size?: ButtonSizeType;
  leftIcon?: GlyphType;
  rightIcon?: GlyphType;
  keyListener?: string;
  theme?: ButtonThemeAppearanceType;
  isCenter?: boolean;
  link?: string,
  isFullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  hidden?: boolean;
}

export function Button({
    size,
    leftIcon,
    rightIcon,
    keyListener,
    theme,
    isCenter,
    link,
    isFullWidth,
    className,
    children,
    onClick,
    type,
    disabled,
}: ButtonProps) {
    const themeData = useTheme();
    const {t, s} = getThemes(themeData, theme, size);

    useEffect(() => {
        if (keyListener && onClick) {
            const onKeyUp = (event: KeyboardEvent) => {
                if (
                    event.code === keyListener &&
                    !disabled && // @ts-ignore
                    ((event.target.nodeName !== 'INPUT' && // @ts-ignore
                    event.target.nodeName !== 'TEXTAREA') ||
                    (keyListener === 'Backslash' && (event.ctrlKey || event.metaKey)))
                ) {
                    event.preventDefault();
                    onClick();
                }
            };
            window.addEventListener('keydown', onKeyUp);
            return () => {
                window.removeEventListener('keydown', onKeyUp);
            };
        }
    }, [onClick, keyListener]);

    const Component = link
        ? (props) => <Link to={link as string} {...props} />
        : (props) => <button {...props} />;

    return (
        <Component
            onClick={onClick}
            type={type}
            className={className}
            disabled={disabled}
            css={css`
                background-color: ${t.default.bgColor};
                color: ${t.default.textColor};
                opacity: ${t.default.opacity};
                border: 2px solid ${t.default.borderColor};
                border-radius: 12px;
                padding: 0 ${s.lrPadding}px;
                height: ${s.height}px;
                outline: none;
        
                position: relative;
        
                display: inline-flex;
                align-items: center;
                justify-content: center;
        
                cursor: pointer;
                user-select: none;
        
                font-weight: 500;
                font-size: 15px;
                line-height: 24px;
        
                transition: 0.1s ease;
        
                ${isCenter &&
                css`
                  margin: 0 auto;
                `}
                ${isFullWidth &&
                css`
                  width: 100%;
                `}
                ${!children &&
                css`
                  width: ${s.height}px;
                  padding: 0;
                `}
        
                &::before {
                  content: ' ';
                  border: 6px solid ${themeData.colors.transparent.default};
                  background-color: ${themeData.colors.transparent.default};
                  border-radius: 18px;
                  transition: 0.1s ease;
                  opacity: 0.1;
                  position: absolute;
                  left: -8px;
                  top: -8px;
                  right: -8px;
                  bottom: -8px;
                }
                &:hover {
                  background-color: ${t.hover?.bgColor};
                  color: ${t.hover?.textColor};
                  opacity: ${t.hover?.opacity};
                  border: 2px solid ${t.hover?.borderColor};
                  > svg {
                    fill: ${t.hover?.textColor};
                  }
                }
                &:focus {
                  &::before {
                    border: 6px solid ${t.focused?.outlineColor || t.hover?.bgColor};
                  }
                }
                &:disabled,
                &[disabled] {
                  opacity: ${t.disabled?.opacity};
                  pointer-events: none;
                }

            `}
        >
            {leftIcon && (
                <>
                    <Icon glyph={leftIcon} color={t.default.textColor} />
                    {children && <Space size={8} isInline />}
                </>
            )}
            {children}

            {rightIcon && (
                <>
                    {children && <Space size={8} isInline />}
                    <Icon glyph={rightIcon} color={t.default.textColor} />
                </>
            )}
        </Component>
    );
}

export default Button;
