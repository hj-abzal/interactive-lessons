import React, {useEffect, useState} from 'react';
import {css} from '@emotion/react';
import AnchorPoint, {AnchorType} from './anchor-point';
import {getImage} from '@/codgen/all-images';

export type LayerType = {
    id: string;
    isCorrect?: boolean;
    src?: string;
    isShown?: boolean;
    transform?: string;
    filter?: string;
    opacity?: number;
    transition?: string;
};

export interface LayeredObjectProps {
    width: string;
    height: string;
    layers: LayerType[];
    anchors?: AnchorType[];
    transform?: string;
    transition?: string;
}

const LayeredObject = ({layers, width, height, anchors: initAnchors, transform, transition}:LayeredObjectProps) => {
    const [anchors, setAnchors] = useState<AnchorType[]>(initAnchors || []);

    useEffect(() => {
        setAnchors(initAnchors || []);
    }, [initAnchors]);

    return (
        <div css={css`
            position: relative;
            width: ${width};
            height: ${height};
        `}>
            <div css={css`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transition: ${transition ? transition : '0.5s ease'};
                transform: ${transform ? transform : 'none'};
            `}>
                {layers.map((layer, index) => layer.src && <div css={css`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transition: ${layer.transition ? layer.transition : '0.5s ease'};
                    transform: ${layer.transform ? layer.transform : `scale(${layer.isShown ? 1 : 1.1})`};
                    opacity: ${layer.isShown ? ((layer.opacity && layer.opacity / 100) || 1) : 0};
                    filter: ${layer.filter ? layer.filter : 'none'};
                    background: url(${getImage(layer.src) || layer.src}) no-repeat center center;
                    background-size: contain;
                `} key={layer.src + index} />)}
            </div>
            <div css={css`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            `}>
                {anchors.map((p, i) =>
                    <AnchorPoint
                        key={`anchor-${i}`}
                        setIsActive={(isActive) => setAnchors((old) => {
                            return old.map((anchor, index) => {
                                if (i === index || (anchor.tag && anchor.tag === p.tag)) {
                                    return {
                                        ...anchor,
                                        isActive: isActive,
                                    };
                                }
                                return anchor;
                            });
                        })}
                        setIsHovered={(isHovered) => setAnchors((old) => {
                            return old.map((anchor, index) => {
                                if (i === index || (anchor.tag && anchor.tag === p.tag)) {
                                    return {
                                        ...anchor,
                                        isHovered: isHovered,
                                    };
                                }
                                return anchor;
                            });
                        })}
                        {...p}
                    />
                )}
            </div>
        </div>
    );
};

export default LayeredObject;
