import ekosistemaOtkritiiOkean from '@/codgen/ekosistemaOtkritiiOkean';
import {LayerType} from '@/components/interactive-parallax';

export const layersData: LayerType[] = [
    {
        src: ekosistemaOtkritiiOkean.fon[1],
        className: 'sad-layer-1',
        width: 1280,
    },
    {
        src: ekosistemaOtkritiiOkean.fon[2],
        className: 'sad-layer-2',
        width: 1440,
    },
    {
        src: ekosistemaOtkritiiOkean.fon[3],
        className: 'sad-layer-3',
        width: 1600,
        objectsNames: ['kit'],
    },
    {
        src: ekosistemaOtkritiiOkean.fon[4],
        className: 'sad-layer-4',
        width: 1760,
        objectsNames: ['akula', 'prilipala'],
    },
    {
        src: ekosistemaOtkritiiOkean.fon[5],
        className: 'sad-layer-5',
        width: 1920,
        objectsNames: ['kosatka', 'zhyoludi'],
    },
    {
        src: ekosistemaOtkritiiOkean.fon[6],
        className: 'sad-layer-6',
        width: 2080,
    },
    {
        src: ekosistemaOtkritiiOkean.fon[7],
        className: 'sad-layer-7',
        width: 2240,
        objectsNames: ['okun', 'minoga'],
    },
    {
        src: ekosistemaOtkritiiOkean.fon[8],
        className: 'sad-layer-8',
        width: 2560,
        objectsNames: ['aktiniya', 'rakotshelnik'],
    }
];
