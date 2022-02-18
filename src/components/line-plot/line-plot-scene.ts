import p5Types from 'p5';
import {static as Immutable} from 'seamless-immutable';
import {CanvasScene} from '@/utils/canvas-scene';
import {defaultTheme} from '@/context-providers/theme/themes';

export type PlotPoint = {
    x: number,
    y: number
}

export type Series = {
    points: PlotPoint[],
    color: string,
};

export type SeriesConfig = {
    [name: string]: Series
};

export type SeriesSetterCb = (old: SeriesConfig) => SeriesConfig;

export type Options = {
    plateBackground?: string,
    canvasHeight: number,
    canvasWidth: number,
    yGridSteps?: number,
    xGridSteps?: number,
    xLegend?: string,
    yLegend?: string,
    yMax?: number,
    yMin?: number,
    xMax?: number,
    xMin?: number,
    lineWidth?: number,
}

export class LinePlotScene extends CanvasScene {
    canvasWidth = 300;
    canvasHeight = 150;
    plateBackground = defaultTheme.colors.grayscale.background;
    borderWidth = 4;
    borderColor = defaultTheme.colors.grayscale.line;
    borderGap = 23;
    lineWidth = 4;

    xLegend = 'xLegend'
    yLegend = 'yLegend';
    yGridSteps = 5;
    xGridSteps = NaN;
    yMax = 100;
    yMin = 0;
    xMax = 100;
    xMin = 0;

    series: SeriesConfig = {};
    seriesNames: string[] = [];
    showSeriesLegend = false;

    gamePaused = false;

    constructor(params: Options) {
        super();
        Object.assign(this, params);
    }

    // visible space for plot lines
    get graphViewOffset() {
        return this.borderGap + this.borderWidth;
    }

    // actual x values range
    get xRange() {
        return this.xMax - this.xMin;
    }

    // actual x values range
    get yRange() {
        return this.yMax - this.yMin;
    }

    // visible axis sizes
    getAxisSizes(p5: p5Types) {
        return {
            x: p5.width - this.graphViewOffset * 2,
            y: p5.height - this.graphViewOffset,
        };
    }

    setSeries(value: SeriesConfig | SeriesSetterCb) {
        if (typeof value === 'function') {
            this.series = value(this.series);
        } else {
            this.series = value;
        }

        this.seriesNames = Object.keys(this.series);
    }

    addPoints(name: string, points: PlotPoint[]) {
        this.setSeries(
            Immutable.merge(this.series, {
                [name]: {
                    points: this.series[name].points.concat(points),
                },
            }, {deep: true})
        );
    }

    drawPlate(p5: p5Types) {
        p5.textAlign('center');

        p5
            .beginShape()
            .strokeWeight(this.borderWidth)
            .stroke(this.borderColor)
            .fill(this.plateBackground)
            .rect(0, 0, p5.width, p5.height, 16)
            .endShape();
    }

    drawLegend(p5: p5Types) {
        // left border
        p5
            .beginShape()
            .strokeWeight(2)
            .stroke(this.borderColor)
            .line(this.borderGap, 0, this.borderGap, p5.height - this.borderGap)
            .endShape();

        // right border
        p5
            .beginShape()
            .strokeWeight(2)
            .stroke(this.borderColor)
            .line(p5.width - this.borderGap, 0, p5.width - this.borderGap, p5.height - this.borderGap)
            .endShape();

        // bottom border
        p5
            .beginShape()
            .strokeWeight(2)
            .stroke(this.borderColor)
            .line(0, p5.height - this.borderGap, p5.width, p5.height - this.borderGap)
            .endShape();

        if (this.yLegend) {
            // y legend
            p5
                .beginShape()
                .strokeWeight(0)
                .fill('#aaa')
                .rotate(-Math.PI / 2)
                .text(this.yLegend, (-p5.height / 2) + this.borderGap / 4, 15)
                .rotate(Math.PI / 2)
                .endShape();
        }

        if (![this.yMin, this.yMax, this.yGridSteps].some(Number.isNaN)) {
            // y scale
            const yStepSize = this.yRange / this.yGridSteps;

            const yStepPixelSize = Math.round(p5.height / this.yGridSteps);

            for (let index = 1; index < this.yGridSteps; index++) {
                const stepValue = this.yMin + (yStepSize * index);
                const stepPosition = p5.height - (yStepPixelSize * index + this.borderGap / 2);

                p5
                    .beginShape()
                    .strokeWeight(0)
                    .fill('#aaa')
                    .text(stepValue.toFixed(1), p5.width - 13, stepPosition + 4)
                    .strokeWeight(2)
                    .stroke('#aaa')
                    .line(p5.width - 30, stepPosition, p5.width - 25, stepPosition);
            }
        }

        if (this.xLegend) {
            // x legend
            p5
                .beginShape()
                .strokeWeight(0)
                .fill('#aaa')
                .text(this.xLegend, p5.width / 2, p5.height - 8)
                .endShape();
        }

        if (![this.xMin, this.xMax, this.xGridSteps].some(Number.isNaN)) {
            // TODO: по дизайну не влезает
            // x scale
            const xLength = this.xMax - this.xMin;
            const xStepSize = Math.round(xLength / this.xGridSteps);
            const xStepPixelSize = Math.round(p5.width / this.xGridSteps);

            for (let index = 1; index < this.xGridSteps - 1; index++) {
                const stepValue = xStepSize * index;
                const stepPosition = (xStepPixelSize * index + this.borderGap);

                p5
                    .strokeWeight(0)
                    .fill('#aaa')
                    .text(stepValue, stepPosition, p5.height - 15)
                    .strokeWeight(2)
                    .stroke('#aaa')
                    .line(stepPosition, p5.height - 15, stepPosition, p5.height - 15);
            }
        }

        // series legend
        // TODO: по дизайну не влезает
        if (this.showSeriesLegend) {
            this.seriesNames.forEach((name, i) => {
                p5
                    .beginShape()
                    .fill(this.series[name].color)
                    .circle(this.borderGap + 8, 30 + i * 15, 4)
                    .fill('black')
                    .textAlign('left')
                    .text(name, this.borderGap + 18, 30 + i * 15 + 3)
                    .endShape();
            });
        }
    }

    drawSeries(p5: p5Types) {
        const axisSizes = this.getAxisSizes(p5);

        const ySignOffset = (this.yMin < 0) ? (0 - this.yMin) : 0;
        const xSignOffset = (this.xMin < 0) ? (0 - this.xMin) : 0;

        this.seriesNames.forEach((name) => {
            const points = this.series[name].points;

            p5
                .beginShape()
                .noFill()
                .strokeWeight(this.lineWidth)
                .stroke(this.series[name].color);

            for (let i = 0; i < points.length - 1; i++) {
                const x = ((points[i].x + xSignOffset) * axisSizes.x) / this.xRange;
                const y = ((this.yMax - points[i].y + ySignOffset) * axisSizes.y) / this.yRange;

                p5
                    .vertex(
                        Math.min(this.graphViewOffset + x, p5.width - this.graphViewOffset + 8),
                        y
                    );
            }

            p5.endShape();
        });
    }

    setup(p5: p5Types) {
        p5.createCanvas(this.canvasWidth, this.canvasHeight);
    }

    draw(p5: p5Types) {
        if (this.gamePaused) {
            p5.noLoop();
        }

        this.drawPlate(p5);

        this.drawLegend(p5);

        this.drawSeries(p5);
    }
}
