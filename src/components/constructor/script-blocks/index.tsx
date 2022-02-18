import {combineScriptBlocks} from '@/components/constructor/script-blocks/lib';

import {chatScriptModule} from './chat';
import {commonLayoutScriptModule} from './common-layout';
import {controlLogicScriptModule} from './control-logic';
import {layeredObjectConstructor} from './layered-object-constructor';
import {progressBarsScriptModule} from './progress-bars';
import {membraneScriptModule} from './membrane';
import {stateManagerScriptModule} from './state-manager';
import {timerScriptModule} from './timer';
import {scenesManager} from './scenes-manager';
import {slidersScriptModule} from '@/components/constructor/script-blocks/sliders';
import {sberclassScriptModule} from '@/components/constructor/script-blocks/sberclass';

// TODO: подключать только нужные модули
export const allScriptModules = [
    chatScriptModule,
    commonLayoutScriptModule,
    controlLogicScriptModule,
    layeredObjectConstructor,
    membraneScriptModule,
    scenesManager,
    progressBarsScriptModule,
    stateManagerScriptModule,
    timerScriptModule,
    slidersScriptModule,
    sberclassScriptModule
];

export const useScriptBlocks = combineScriptBlocks(allScriptModules);
