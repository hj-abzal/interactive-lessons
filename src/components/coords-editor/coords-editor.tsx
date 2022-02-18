import React, {useEffect, useRef, useState} from 'react';
import {css} from '@emotion/react';
import {logger} from '@/utils/logger';

type Mark = {
    x: number,
    y: number,
    id: string,
}

export type Props = {
    off?: boolean,
    markWidth: number,
    markHeight: number,
    yPositionError?: number,
    xPositionError?: number,
    initialMarks?: Mark[],
}

export const CoordsEditor = ({
    off = false,
    markWidth,
    markHeight,
    yPositionError = 0,
    xPositionError = 0,
    initialMarks,
}: Props) => {
    const [editorPos, setEditorPos] = useState({x: 0, y: 0});
    const compRef = useRef<HTMLDivElement>(null);

    const [marks, setMarks] = useState<Mark[]>(initialMarks || []);

    useEffect(() => {
        if (!off) {
            logger.debug('MARKS', marks);
        }
    }, [marks, off]);

    if (off) {
        return null;
    }

    const realtivePos = compRef?.current ? {
        x: editorPos.x - compRef?.current?.getBoundingClientRect().x + xPositionError,
        y: editorPos.y - compRef?.current?.getBoundingClientRect().y + yPositionError,
    }
        : {x: 0, y: 0};

    const onMarksZoneClick = (e) => {
        setMarks((state) => {
            const eCoords = {
                x: e.clientX - markWidth,
                y: e.clientY - markHeight,
            };

            const filteredState = state
                .filter((mark) => {
                    const inBoundsByX = ((mark.x - markWidth / 2) < eCoords.x)
                        && ((mark.x + markWidth / 2) > eCoords.x);

                    const inBoundsByY = ((mark.y - markHeight / 2) < eCoords.y)
                        && ((mark.y + markHeight / 2) > eCoords.y);

                    const inBounds = inBoundsByX && inBoundsByY;

                    return !inBounds;
                });

            // if any mark removed
            if (filteredState.length !== state.length) {
                return filteredState;
            }

            return state.concat({x: realtivePos.x, y: realtivePos.y, id: String(state.length + 1)});
        });
    };

    return (
        <div
            css={css`
                border: 1px solid orange;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 500;
                
                &::before {
                  content: "coords-editor";
                  padding: 4px;
                  position: absolute;
                  top: -24px;
                  left: 0;
                  background-color: orange;
                }
                
                .editor-coords-meta {
                  position: absolute;
                  top: ${editorPos.y}px;
                  left: ${editorPos.x}px;
                  font-family: monospace;
                }
                
                .editor-coords-pointer {
                  position: absolute;
                  width: 60px;
                  height: 60px;
                  background-color: yellow;
                  top: ${editorPos.y - 60}px;
                  left: ${editorPos.x - 60}px;
                  opacity: 0.8;
                }
            `}
            ref={compRef}
            onMouseMove={(e) => {
                setEditorPos({x: e.clientX, y: e.clientY});
            }}
            onClick={onMarksZoneClick}
        >
            <div className="editor-coords-meta">
                coords: {editorPos.x} {editorPos.y}
                <br/>
                realtivePos {realtivePos.x} {realtivePos.y}
            </div>
            <div className="editor-coords-pointer" />

            {marks.map((mark, index) => (
                <div
                    key={mark.id}
                    css={css`
                          font-family: monospace;
                          position: absolute;
                          width: ${markWidth}px;
                          height: ${markHeight}px;
                          background-color: orange;
                          top: ${mark.y}px;
                          left: ${mark.x}px;
                          opacity: 0.8;
                    `}>
                    id {mark.id}
                    <br />
                    index {index}
                </div>
            ))}
        </div>
    );
};
