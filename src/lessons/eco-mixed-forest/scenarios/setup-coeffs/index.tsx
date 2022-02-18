import React from 'react';
import {css, useTheme} from '@emotion/react';
import {LinePlotScene} from '@/components/line-plot/line-plot-scene';
import {CanvasSketch} from '@/components/canvas-sketch';
import {useImmerState} from '@/utils/use-immer-state';
import Button from '@/components/button';
import {ode} from '@/lessons/eco-mixed-forest/components/simulation/math';
import {SimulationPoints} from '@/lessons/eco-mixed-forest/components/simulation/types';
import {logger} from '@/utils/logger';

const linePlotScene = new LinePlotScene({
    canvasWidth: 300,
    canvasHeight: 200,
    xMax: 10000,
    xMin: 0,
    yMin: 0,
    yMax: 10,
    xLegend: 'Время',
    yLegend: 'Численность',
});

const s = (n) => Number(n) < 0 ? Number(n) : `+${Number(n)}`;

export const SetupCoeffs = () => {
    const theme = useTheme();

    const [coeffs, produceCoeffs] = useImmerState({
        x0: '0',
        y0: '0',
        a1: '0',
        a2: '0',
        a3: '0',
        b1: '0',
        b2: '0',
        b3: '0',
    });

    return (
        <div css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            
            .form {
              flex-direction: row;
              margin-top: 10px;
              
              input {
                width: 40px;
              };
            }
        `}>
            <CanvasSketch
                className="simulation-population-plot"
                name="population-plot"
                sketch={linePlotScene.sketch}
            />
            <div className='form'>
                <input
                    onChange={(e) => produceCoeffs((draft) => {
                        draft.a1 = e.target.value;
                    })}
                />
                x +
                <input
                    onChange={(e) => produceCoeffs((draft) => {
                        draft.a2 = e.target.value;
                    })}
                />
                xy -
                <input
                    value={coeffs.a3}
                    onChange={(e) => produceCoeffs((draft) => {
                        draft.a3 = e.target.value;
                    })}
                />x*x
            </div>
            <div className='form'>
                <input
                    onChange={(e) => produceCoeffs((draft) => {
                        draft.b1 = e.target.value;
                    })}
                />
                y +
                <input
                    onChange={(e) => produceCoeffs((draft) => {
                        draft.b2 = e.target.value;
                    })}
                />
                xy -
                <input
                    onChange={(e) => produceCoeffs((draft) => {
                        draft.b3 = e.target.value;
                    })}
                />y*y
            </div>
            <div className='form'>
                X0=<input
                    onChange={(e) => produceCoeffs((draft) => {
                        draft.x0 = e.target.value;
                    })}
                />
                {'    '}Y0=
                <input
                    onChange={(e) => produceCoeffs((draft) => {
                        draft.y0 = e.target.value;
                    })}
                />
            </div>
            <div>
                <br/>
                <br/>
                {s(coeffs.a1)}x {s(coeffs.a2)}xy -{coeffs.a3}x*x
                <br />
                {s(coeffs.b1)}y {s(coeffs.b2)}xy -{coeffs.b3}y*y
            </div>
            <Button
                onClick={() => {
                    const evaluationResult = ode(
                        Number(coeffs.x0),
                        Number(coeffs.y0),
                        Number(coeffs.a1),
                        Number(coeffs.a2),
                        Number(coeffs.a3),
                        Number(coeffs.b1),
                        Number(coeffs.b2),
                        Number(coeffs.b3)
                    );

                    const maxVal = Math.max(...evaluationResult.map((val) => Math.max(val[0], val[1])));
                    const minVal = Math.min(...evaluationResult.map((val) => Math.min(val[0], val[1])));

                    const formattedPoints: SimulationPoints = {
                        first: [],
                        second: [],
                    };

                    evaluationResult.slice(0).forEach((point, i) => {
                        formattedPoints.first.push({
                            y: point[0],
                            x: i,
                        });

                        formattedPoints.second.push({
                            y: point[1],
                            x: i,
                        });
                    });

                    linePlotScene.yMin = minVal;
                    linePlotScene.yMax = maxVal;

                    logger.debug('ODE_EVALUATION', {evaluationResult, maxVal, minVal});

                    linePlotScene.setSeries({
                        first: {
                            points: formattedPoints.first,
                            color: theme.colors.primary.default,
                        },
                        second: {
                            points: formattedPoints.second,
                            color: theme.colors.tiger.default,
                        },
                    });
                }}
            >
                Рассчитать
            </Button>
        </div>
    );
};
