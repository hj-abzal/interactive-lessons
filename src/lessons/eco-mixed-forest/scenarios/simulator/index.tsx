import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {ecoMixedBiosphereRouter} from '@/lessons/eco-mixed-forest/routes';
import {SimulatorProvider} from '@/lessons/eco-mixed-forest/scenarios/simulator/context';
import {ForestStep} from '@/lessons/eco-mixed-forest/scenarios/simulator/steps/forest';
import {RelationsStep} from '@/lessons/eco-mixed-forest/scenarios/simulator/steps/relations';
import {SimulationStep} from '@/lessons/eco-mixed-forest/scenarios/simulator/steps/simulation';

export const Simulator = () => {
    return (
        <SimulatorProvider>
            <Switch>
                <Route
                    component={ForestStep}
                    {...ecoMixedBiosphereRouter.routes.simulatorForest}
                />
                <Route
                    {...ecoMixedBiosphereRouter.routes.simulatorRelationship}
                    component={RelationsStep}
                />

                <Route
                    {...ecoMixedBiosphereRouter.routes.simulatorSimulation}
                    component={SimulationStep}
                />
            </Switch>
        </SimulatorProvider>
    );
};
