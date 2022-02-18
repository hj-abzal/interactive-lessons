import {css} from '@emotion/react';
import React from 'react';
import ParallaxMousemove from 'react-parallax-mousemove';
import {useSmartViewportWrapper} from '@/context-providers/smart-viewport-wrapper';
import {getParallaxProps, Layer, outerStyle, Wrapper} from './css';
import LayerObject, {LayerObjectType} from './layer-object';

export interface InteractiveParallaxProps {
  layersData: LayerType[];
  objectsData: LayerObjectType[];
  sceneParams?: {
    parallaxFactor?: number;
    transform?: string;
    filter?: string;
    isHidden?: boolean;
  }
}

export type LayerType = {
  src: string;
  width: number;
  opacity?: number;
  objectsNames?: string[];
  objectsNamesBefore?: string[];
  className?: string;
  filter?: string;
  transform?: string;
};

const InteractiveParallax = ({layersData, objectsData, sceneParams}: InteractiveParallaxProps) => {
    const {contentWidth, contentHeight} = useSmartViewportWrapper();

    return (
        <Wrapper
            screenWidth={contentWidth}
            transform={sceneParams?.transform}
            isHidden={sceneParams?.isHidden}
        >
            <ParallaxMousemove containerStyle={outerStyle} >
                {layersData.map((layerData, layerIndex) =>
                    <ParallaxMousemove.Layer

                        key={layerData.src + layerIndex}
                        {...getParallaxProps(layerData.width, contentWidth, sceneParams?.parallaxFactor)}
                    >
                        <div css={css`
                            transform: ${layerData.transform || 'none'};
                        `}>
                            {layerData.objectsNamesBefore?.map((objName) => {
                                const objectData = objectsData.filter((obj) => obj.name === objName)[0];
                                if (objectData) {
                                    return (<LayerObject
                                        className={layerData.className + '-objects'}
                                        filter={sceneParams?.filter}
                                        key={`l${layerIndex}o${objName}`}
                                        {...objectData}
                                    />);
                                } else {
                                    return <></>;
                                }
                            }
                            )}
                            <Layer
                                src={layerData.src}
                                opacity={layerData.opacity}
                                width={layerData.width}
                                contentWidth={contentWidth}
                                contentHeight={contentHeight}
                                className={layerData.className}
                                filter={layerData.filter || sceneParams?.filter}
                            />
                            {layerData.objectsNames?.map((objName) => {
                                const objectData = objectsData.filter((obj) => obj.name === objName)[0];
                                if (objectData) {
                                    return (<LayerObject
                                        className={layerData.className + '-objects'}
                                        filter={sceneParams?.filter}
                                        key={`l${layerIndex}o${objName}`}
                                        {...objectData}
                                    />);
                                } else {
                                    return <></>;
                                }
                            }
                            )}
                        </div>
                    </ParallaxMousemove.Layer>)}
            </ParallaxMousemove>
        </Wrapper>
    );
};

export default InteractiveParallax;
