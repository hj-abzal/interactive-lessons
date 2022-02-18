import React from 'react';
import {RelationType} from '@/lessons/eco-mixed-forest/context/types';
import {LinePlotScene} from '@/components/line-plot/line-plot-scene';
import Card from '@/components/card';
import {CanvasSketch} from '@/components/canvas-sketch';
import {ode} from '@/lessons/eco-mixed-forest/components/simulation/math';
import {SimulationPoints} from '@/lessons/eco-mixed-forest/components/simulation/types';
import {defaultTheme} from '@/context-providers/theme/themes';
import {css} from '@emotion/react';

const linePlotScene = new LinePlotScene({
    canvasWidth: 300,
    canvasHeight: 200,
    xMax: 10000,
    yGridSteps: undefined,
    xMin: 0,
    yMin: 0,
    yMax: 10,
    xLegend: 'Время',
    yLegend: 'Численность',
});

const evaluationResult = ode(
    4,
    2,
    -2,
    1,
    0,
    2,
    -1,
    0
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

linePlotScene.setSeries({
    first: {
        points: formattedPoints.first,
        color: defaultTheme.colors.primary.default,
    },
    second: {
        points: formattedPoints.second,
        color: defaultTheme.colors.tiger.default,
    },
});

export type Props = {
    relationType: RelationType
}

export const AddtitionalInfoPopup = ({
    relationType,
}: Props) => {
    return (
        <div css={css`
            padding-top: 180px;
            padding-bottom: 80px;
        `}>
            <Card>
                <div css={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    padding: 16px;
                    max-width: 680px;
                    
                    .simulation-population-plot {
                      margin-bottom: 16px;
                    }
            `}>
                    <CanvasSketch
                        className="simulation-population-plot"
                        name="population-plot"
                        sketch={linePlotScene.sketch}
                    />
                    {relationType === RelationType.PredatorPrey
                        ? (
                            <>
                                <p>
                                    На самом деле на промежутке времени отношения хищника
                                    и жертвы описываются более сложным путем.
                                    Модель их отношений ты сейчас можешь наблюдать на <strong>графиках</strong>.
                                </p>
                                <br/>
                                <p>
                                    Отношения между хищниками и жертвами развиваются циклически.
                                    Если хищников становится слишком много, то тогда стремительно погибают жертвы.
                                    Но жертвы не вымирают, т.к. при их малом количестве погибают
                                    и хищники из-за недостатка пищи.
                                    Уменьшенная из-за голода популяция хищников дает “зелёный свет”
                                    популяции жертв: они активно размножаются.
                                    Вскоре увеличивается и популяция хищников, т.к. для них увеличилась кормовая база.
                                    Такие взлёты и спады численностей у обеих популяций повторяются во времени,
                                    но всегда с некоторой задержкой во времени.
                                </p>
                            </>
                        )
                        : (
                            <>
                                <p>
                                    На самом деле на промежутке времени отношения паразита и хозяина описываются
                                    более сложным путем.
                                    Модель их отношений ты сейчас можешь наблюдать на <strong>графиках</strong>.
                                </p>
                                <br/>
                                <p>
                                    Ты можешь заметить, что модель в целом такая же,
                                    как и в отношениях хищника и жертвы. Это не случайно,
                                    ведь оба этих типа отношений являются {' '}
                                    <strong>+/-</strong>.
                                </p>
                                <br/>
                                <p>
                                    Отношения между паразитами и хозяевами развиваются циклически.
                                    Если паразитов становится слишком много, то тогда стремительно
                                    погибают зараженные хозяева.
                                    Но зараженные хозяева не вымирают, ведь тогда и паразитов становится меньше
                                    (они теряют среду для жизни и размножения).
                                    Уменьшенная популяция паразитов дает “зелёный свет”
                                    популяции хозяев: они активно размножаются.
                                    Вскоре увеличивается и популяция паразитов, т.к. они могут
                                    заражать новых особей.
                                    Такие взлёты и спады численностей у обеих популяций повторяются во времени,
                                    но всегда с некоторой задержкой во времени.
                                </p>
                            </>
                        )
                    }
                </div>
            </Card>
        </div>
    );
};
