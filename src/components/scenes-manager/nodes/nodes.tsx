import {NodeTypeEnum} from '../types';
import NodeLayer from './node-layer';
import NodeObject from './node-object';
import NodePoint from './node-point';
import NodeText from './node-text';
import {NodeDropArea} from '@/components/scenes-manager/nodes/node-drop-area';
import NodePathAnimation from './node-path-animation';
import NodeStrictWrapper from './node-strict-wrapper';

export const nodeByType: Record<string, any> = {
    [NodeTypeEnum.Object]: NodeObject,
    [NodeTypeEnum.Layer]: NodeLayer,
    [NodeTypeEnum.DropArea]: NodeDropArea,
    [NodeTypeEnum.Point]: NodePoint,
    [NodeTypeEnum.Text]: NodeText,
    [NodeTypeEnum.PathAnimation]: NodePathAnimation,
    [NodeTypeEnum.StrictWrapper]: NodeStrictWrapper,
};
