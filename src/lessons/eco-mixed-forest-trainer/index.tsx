import React from 'react';
import {createLesson} from '@/components/lesson-container';
import {ScenarioProvider} from '@/lessons/eco-mixed-forest/context/scenario-context';
import {Trainer} from '@/lessons/eco-mixed-forest/scenarios/trainer';

const EcoMixedForest = () => (
    <ScenarioProvider>
        <Trainer />
    </ScenarioProvider>
);

export default createLesson(EcoMixedForest, 'eco-mixed-forest-trainer');
