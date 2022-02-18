import React from 'react';
import {TrainerProvider} from './context';
import {Task} from '@/lessons/eco-mixed-forest/scenarios/trainer/steps/task';

export const Trainer = () => {
    return (
        <TrainerProvider>
            <Task />
        </TrainerProvider>
    );
};
