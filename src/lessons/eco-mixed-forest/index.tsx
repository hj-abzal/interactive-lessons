import React from 'react';
import {createLesson} from '@/components/lesson-container';
import {Route, Switch} from 'react-router-dom';
import {LessonDevtools} from '@/components/devtools/lesson-devtools';
import {Simulator} from '@/lessons/eco-mixed-forest/scenarios/simulator';
import {ecoMixedBiosphereRouter} from '@/lessons/eco-mixed-forest/routes';
import {ScenarioProvider} from '@/lessons/eco-mixed-forest/context/scenario-context';
import {PersistMemoryRouter} from '@/components/persist-memory-router';
import {SetupCoeffs} from '@/lessons/eco-mixed-forest/scenarios/setup-coeffs';
import {Trainer} from '@/lessons/eco-mixed-forest/scenarios/trainer';

const EcoMixedForest = () => (
    <ScenarioProvider>
        <PersistMemoryRouter
            initialEntries={[ecoMixedBiosphereRouter.build('simulator')]}
        >
            <Switch>
                <Route
                    {...ecoMixedBiosphereRouter.routes.simulator}
                    component={Simulator}
                />
                <Route
                    {...ecoMixedBiosphereRouter.routes.trainer}
                    component={Trainer}
                />
                <Route
                    {...ecoMixedBiosphereRouter.routes.setupCoeffs}
                    component={SetupCoeffs}
                />
            </Switch>
            <LessonDevtools
                navigation={{
                    links: ecoMixedBiosphereRouter.idsArr.map((key) => ({
                        name: key,
                        path: ecoMixedBiosphereRouter.build(key),
                    })),
                }}
            />
        </PersistMemoryRouter>
    </ScenarioProvider>
);

export default createLesson(EcoMixedForest, 'eco-mixed-forest');
