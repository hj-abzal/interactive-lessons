import React, {useEffect, useRef, useState} from 'react';
import styled from '@emotion/styled';
import {components} from 'react-select';
import classNames from 'classnames';
import {Clickable} from '@/components/clickable';
import Icon from '@/components/icon';
import {useTheme} from '@emotion/react';
import ReactTooltip from 'react-tooltip';

export const StyledOption = styled.div`
    position: relative;
    transition: box-shadow 0.3s ease;
    &.with-left-indent {
        .input-select__option {
            padding-left: 28px;
        }
    }
    &.is-selected .input-select__option {
        background-color: ${(p) => p.theme.colors.primary.default} !important;
        color: white;
    }
    > button {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        pointer-events: none;
    }
    &:hover, &.is-menu-open {
        > button {
            opacity: 1;
            pointer-events: auto;
        }
        .drag-handle {
            opacity: 1;
        }
    }

    &.is-dragging {
        z-index: 9;
        & > div {
            background-color: ${(p) => p.theme.colors.primary.light};
        }
    }
    .more-stage-menu-list {
        display: flex;
        flex-direction: column;
        background: white;
        color: ${(p) => p.theme.colors.grayscale.offBlack};
        border-radius: 8px;
        padding: 2px;
        opacity: 1 !important;
        ${(p) => p.theme.shadows.mediumDark};
        > button {
            display: block;
            padding: 8px;
            border-radius: 6px;
            width: 100%;
            &:hover {
                background: ${(p) => p.theme.colors.primary.light};
            }
        }
    }
    .drag-handle {
        opacity: 0.5;
        pointer-events: auto;
        left: 8px;
        cursor: grab;
        &:active {
            cursor: grabbing;
        }
    }
`;

export type MenuItem = {
    name: string,
    onClick: (value: string) => void,
}

export type Props = {
    currentId: string;
    menuItems: MenuItem[];
    options: {label:string; value: string;}[];
    [key: string]: any;
}

export const OptionWithMenu = ({
    menuItems,
    // react-select shit
    isSelected,
    value,
    options,
    ...props
}: Props) => {
    const [index, setIndex] = useState(0);
    const theme = useTheme();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIndex(options.map((option) => option.value).indexOf(value));
    }, [options]);

    return (
        <StyledOption
            ref={ref}
            className={classNames({
                // 'is-menu-open': isMenuOpen,
                'is-selected': isSelected,
            })}>

            <components.Option {...props} />

            <Clickable
                data-tip={value}
                data-for={'stage-menu'}
            >
                <Icon
                    glyph='More'
                    color={
                        isSelected
                            ? theme.colors.grayscale.offWhite
                            : theme.colors.grayscale.offBlack
                    }/>
            </Clickable>
            {index === options.length - 1
                && <ReactTooltip
                    className='more-stage-menu-list'
                    effect='solid'
                    event='click'
                    clickable={true}
                    type='light'
                    place='bottom'
                    multiline={true}
                    id='stage-menu'
                    backgroundColor={theme.colors.grayscale.white}
                    getContent={(value) => <>
                        {menuItems.map((item) => (
                            <Clickable key={item.name} onClick={() => item.onClick(value)}>
                                {item.name}
                            </Clickable>
                        ))}
                    </>
                    }

                />}
        </StyledOption>
    );
};
