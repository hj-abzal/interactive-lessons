import {createRoutes} from '@/utils/routes';
import {StrangerVisionFirstTrain} from './scenarios/train-1';
import {StrangerVision} from './steps/stranger-vision';

export const strangerVisionRouter = createRoutes({
    strangerVision: {
        component: StrangerVision,
        path: '/stranger-vision',
        exact: true,
    },
    strangerVisionFirstTrain: {
        component: StrangerVisionFirstTrain,
        path: '/stranger-vision-first-train',
        exact: true,
    },
});
