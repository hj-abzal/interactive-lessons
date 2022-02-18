import {CanvasScene} from '@/utils/canvas-scene';
import {LinePlotScene, SeriesConfig, SeriesSetterCb} from '@/components/line-plot/line-plot-scene';
import p5Types from 'p5';

export type Options = {
    linePlotScene: LinePlotScene,
    windowSize?: number,
    maxWindowSize?: number,
}

/**
 * @name TimeSeriesPlotScene
 * Нужен для анимированного отображения длинных графиков, скорее всего временных
 */
export class TimeSeriesPlotScene extends CanvasScene {
    linePlotScene: LinePlotScene;

    seriesQueue: SeriesConfig = {};
    seriesNames: string[] = [];

    windowSize = 1;
    maxWindowSize = 0;

    constructor(options: Options) {
        super();
        this.linePlotScene = options.linePlotScene;
        this.windowSize = options.windowSize || this.windowSize;
    }

    setSeries(value: SeriesConfig | SeriesSetterCb) {
        if (typeof value === 'function') {
            this.seriesQueue = value(this.seriesQueue);
        } else {
            this.seriesQueue = value;
        }

        this.seriesNames = Object.keys(this.seriesQueue);
    }

    setup(p5: p5Types) {
        this.linePlotScene.setup(p5);
    }

    drawByTimer(p5: p5Types, timeFrame: number) {
        if (!this.maxWindowSize) {
            // Добавляет доп точки в окно, чтобы при анимационном сдвиге не было пробелов
            const rightOffsetFix = 2;

            this.maxWindowSize = this.linePlotScene.xMax + rightOffsetFix;
        }

        const visibleSeries: SeriesConfig = this.seriesNames.reduce((acc: SeriesConfig, name: string) => {
            const queue = this.seriesQueue[name];

            let truncatedPoints = queue.points.slice(
                0,
                Math.min(timeFrame * this.windowSize, queue.points.length)
            );

            truncatedPoints = truncatedPoints.slice(
                Math.max(truncatedPoints.length - this.maxWindowSize, 0)
            );

            truncatedPoints = truncatedPoints.map((p, i) => ({
                y: p.y,
                x: i,
            }));

            acc[name] = {
                ...queue,
                points: truncatedPoints,
            };

            return acc;
        }, {});

        this.linePlotScene.setSeries(visibleSeries);

        this.linePlotScene.draw(p5);
    }
}
