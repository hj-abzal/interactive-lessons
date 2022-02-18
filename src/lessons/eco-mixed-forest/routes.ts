import {createRoutes} from '@/utils/routes';

export const ecoMixedBiosphereRouter = createRoutes({
    simulator: {
        path: '/simulator/:step',
        exact: false,
        defaultParams: {
            step: 'forest',
        },
        queryParams: {
            relationTypeInd: 'relationTypeInd',
            withOnboarding: 'withOnboarding',
            biosphere: 'biosphere',
        },
        defaultQueryParams: {
            withOnboarding: 1,
            biosphere: 'Forest',
        },
    },
    simulatorForest: {
        path: '/simulator/forest',
        exact: false,
        queryParams: {
            relationTypeInd: 'relationTypeInd',
            withOnboarding: 'withOnboarding',
            biosphere: 'biosphere',
        },
        defaultQueryParams: {
            withOnboarding: 1,
            biosphere: 'Forest',
        },
    },
    simulatorRelationship: {
        path: '/simulator/relationship',
        exact: false,
        queryParams: {
            relationTypeInd: 'relationTypeInd',
            withOnboarding: 'withOnboarding',
            biosphere: 'biosphere',
        },
        defaultQueryParams: {
            withOnboarding: 1,
            biosphere: 'Forest',
        },
    },
    simulatorSimulation: {
        path: '/simulator/simulation',
        exact: false,
        queryParams: {
            relationTypeInd: 'relationTypeInd',
            withOnboarding: 'withOnboarding',
            biosphere: 'biosphere',
        },
        defaultQueryParams: {
            withOnboarding: 1,
            biosphere: 'Forest',
        },
    },
    trainer: {
        path: '/trainer',
        exact: false,
    },
    setupCoeffs: {
        path: '/setupCoeffs',
        exact: false,
    },
});
