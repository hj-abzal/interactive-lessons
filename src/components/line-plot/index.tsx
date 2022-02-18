import React, {useEffect, useState} from 'react';
import {Options, LinePlotScene, SeriesConfig} from './line-plot-scene';
import {CanvasSketch} from '@/components/canvas-sketch';

export type Props = Options & {
    series?: SeriesConfig,
}

export const LinePlot = ({
    series,
    ...sceneOptions
}: Props) => {
    const [scene, setScene] = useState<LinePlotScene | null>(null);

    useEffect(() => {
        const _scene = new LinePlotScene(sceneOptions);

        setScene(_scene);
    }, []);

    useEffect(() => {
        if (scene && series) {
            scene.setSeries(series);
        }
    }, [scene, series]);

    if (!scene) {
        return <span>Scene not inited...</span>;
    }

    return (
        <CanvasSketch name="line-plot" sketch={scene.sketch} />
    );
};
