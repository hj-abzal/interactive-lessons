import React, {useEffect, useState} from 'react';
import {CanvasSketch, Props} from './';
import {Story} from '@storybook/react';
import {CanvasScene} from '@/utils/canvas-scene';

export default {
    component: CanvasSketch,
    title: 'CanvasSketch',
    parameters: {
        docs: {
            description: {
                component: 'Компонент для встраивания p5 canvas',
            },
            source: {
                type: 'code',
            },
        },
    },
};

export const Default: Story<Props> = (args) => {
    const [scene, setScene] = useState<CanvasScene | null>(null);

    useEffect(() => {
        class SomeSketch extends CanvasScene {
            x = 50;
            y = 50;

            setup(p5) {
                p5.createCanvas(500, 300);
            }

            draw(p5) {
                p5.background(0);
                p5.ellipse(this.x, this.y, 70, 70);
                this.x++;
            }
        }

        const _scene = new SomeSketch();

        setScene(_scene);
    }, []);

    if (!scene) {
        return <span>Scene not inited...</span>;
    }

    return (
        <CanvasSketch {...args} sketch={scene.sketch} />
    );
};
