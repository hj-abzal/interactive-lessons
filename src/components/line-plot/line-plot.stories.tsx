import React, {useEffect, useState} from 'react';
import {CanvasSketch} from '@/components/canvas-sketch';
import {Story} from '@storybook/react';
import {CanvasScene} from '@/utils/canvas-scene';
import {LinePlotScene} from '@/components/line-plot/line-plot-scene';
import {LinePlot, Props} from '@/components/line-plot/index';
import {TimeSeriesPlotScene} from '@/components/line-plot/time-series-plot-scene';
import {createTimer, TimerIntervals} from '@/utils/timers';
import Button from '@/components/button';

export default {
    component: LinePlot,
    title: 'LinePlot',
    parameters: {
        docs: {
            description: {
                component: 'График с линиями',
            },
            source: {
                type: 'code',
            },
        },
    },
};

const aData = (new Array(50)).fill(0).map((_, i) => ({
    x: i,
    y: Math.sin(i / 3),
}));

const bData = (new Array(50)).fill(0).map((_, i) => ({
    x: i,
    y: Math.sin(-i / 3),
}));

const cData = (new Array(50)).fill(0).map((_, i) => ({
    x: i,
    y: Math.cos(i / 3),
}));

const series = {
    'sin(x)': {
        color: 'red',
        points: aData,
    },
    'sin(-x)': {
        color: 'blue',
        points: bData,
    },
    'cos(x)': {
        color: 'orange',
        points: cData,
    },
};

export const Default: Story<Props> = (args) => {
    Object.keys(args).forEach((key) => {
        if (args[key] === undefined) {
            delete args[key];
        }
    });

    return (
        // @ts-ignore
        <LinePlot canvasWidth={300} canvasHeight={200}
            xMax={50}
            xMin={0}
            yMin={-1}
            yMax={1}
            series={series}
            {...args}
        />
    );
};

export const RawCanvasScene: Story = () => {
    const [scene, setScene] = useState<CanvasScene | null>(null);

    useEffect(() => {
        const _scene = new LinePlotScene({
            canvasWidth: 300,
            canvasHeight: 200,
            xMax: 50,
            xMin: 0,
            yMin: -1,
            yMax: 1,
        });

        _scene.setSeries(series);

        setScene(_scene);
    }, []);

    if (!scene) {
        return <span>Scene not inited...</span>;
    }

    return (
        <CanvasSketch name="line-plot" sketch={scene.sketch} />
    );
};

const aTimeSeries = (new Array(1000)).fill(0).map((_, i) => ({
    x: i,
    y: ((Math.sin(i / 3) / (i % 8)) / 2) - 0.5,
}));

const bTimeSeries = (new Array(1000)).fill(0).map((_, i) => ({
    x: i,
    y: (Math.sin(-i / 3) * Math.log(i + 2000) / 10) / Math.log(1000 - i) + 0.5,
}));

const cTimeSeries = (new Array(1000)).fill(0).map((_, i) => ({
    x: i,
    y: (Math.sin(i / 3) * Math.log(i + 2000) / 10) / Math.log(1000 - i) + 0.5,
}));

const dTimeSeries = (new Array(1000)).fill(0).map((_, i) => ({
    x: i,
    y: (Math.cos(-i / 3) * Math.log(i + 2000) / 10) / Math.log(1000 - i) + 0.5,
}));

const timeSeries = {
    a: {
        color: 'red',
        points: aTimeSeries,
    },
    b: {
        color: 'blue',
        points: bTimeSeries,
    },
    c: {
        color: 'purple',
        points: cTimeSeries,
    },
    d: {
        color: 'orange',
        points: dTimeSeries,
    },
};

const sceneTimer = createTimer('time-series-timer');

export const AnimatedTimeSeries: Story = () => {
    const [scene, setScene] = useState<TimeSeriesPlotScene | null>(null);

    useEffect(() => {
        const timeSeriesScene = new TimeSeriesPlotScene({
            linePlotScene: new LinePlotScene({
                canvasWidth: 300,
                canvasHeight: 200,
                xMax: 100,
                xMin: 0,
                yMin: -1,
                yMax: 1,
                xLegend: 'Time',
            }),
        });

        timeSeriesScene.setSeries(timeSeries);
        timeSeriesScene.bindTimer(sceneTimer);

        setScene(timeSeriesScene);
    }, []);

    if (!scene) {
        return <span>Scene not inited...</span>;
    }

    return (
        <>
            <CanvasSketch name="line-plot" sketch={scene.sketch} />
            <Button
                onClick={() => sceneTimer.isRunning()
                    ? sceneTimer.stop()
                    // DANGER! При завязке на react state лучше сделать fps пониже
                    : sceneTimer.start(TimerIntervals.FPS30)
                }
            >
                Toggle play
            </Button>
        </>
    );
};
