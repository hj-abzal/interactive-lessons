import React, {useEffect, useState} from 'react';
import InteractiveParallax, {LayerType} from '@/components/interactive-parallax';
import {layersDataSad, layersDataUnderwater} from './layers';
import {LayerObjectType} from '@/components/interactive-parallax/layer-object';
import {useLesson} from './stages';
import {GolubVisionOverlay} from './custom-layers';
import {browserName} from 'react-device-detect';
import {createObjects} from './objects';

export const StrangerVision = () => {
    const [transform, setTransform] = useState('none');
    const [filter, setFilter] = useState('none');
    const [objects, setObjects] = useState(() => createObjects({nativeObjects: true}));
    const [layersSad, setLayersSad] = useState(layersDataSad);
    const [layersUnderwater, setLayersUnderwater] = useState(layersDataUnderwater);
    const [isUnderWater, setIsUnderWater] = useState(false);
    const [shownScenes, setShownScenes] = useState(['sad']);
    const [isGolubVision, setIsGolubVision] = useState(false);

    const setObject = (objName, data: LayerObjectType) => {
        setObjects((oldObjects) => oldObjects.map((obj) => obj.name === objName ? {...obj, ...data} : obj));
    };

    const setLayerSad = (layerIndex, data: LayerType) => {
        layersSad[layerIndex] = {...layersSad[layerIndex], ...data};
        setLayersSad(layersSad);
    };

    const setLayerUnderwater = (layerIndex, data: LayerType) => {
        layersUnderwater[layerIndex] = {...layersUnderwater[layerIndex], ...data};
        setLayersUnderwater(layersUnderwater);
    };

    const setShownScene = (sceneName) => {
        setShownScenes((oldScenes) => oldScenes.concat([sceneName]));
    };

    const removeShownScene = (sceneName) => {
        setShownScenes((oldScenes) => oldScenes.filter((scene) => scene !== sceneName));
    };

    const isShowScene = (sceneName) => {
        return shownScenes.some((scene) => scene === sceneName);
    };
    const {runStage} = useLesson({
        setTransform,
        setFilter,
        setObject,
        setLayerSad,
        setLayerUnderwater,
        setIsUnderWater,
        setShownScene,
        removeShownScene,
        setIsGolubVision,
    });

    useEffect(() => {
        runStage('start');
    }, []);

    return <div>
        <InteractiveParallax
            layersData={layersSad}
            objectsData={objects}
            sceneParams={{
                transform: isUnderWater ? 'scale(1.9) translate(20%, -40%)' : transform,
                filter: filter,
                parallaxFactor: browserName === 'Safari' ? 0 : 0.2,
                isHidden: !isShowScene('sad'),
            }}
        />

        <InteractiveParallax
            layersData={layersUnderwater}
            objectsData={objects}
            sceneParams={{
                transform: isUnderWater ? 'translate(0%, 0%) scale(1)' : 'translate(0%, 100%)',
                filter: filter,
                parallaxFactor: browserName === 'Safari' ? 0 : 0.2,
                isHidden: !isShowScene('prud'),
            }}
        />
        <GolubVisionOverlay active={isGolubVision} />
    </div>;
};
