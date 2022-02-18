import ekosistemaSmeshanniiLes from '@/codgen/ekosistemaSmeshanniiLes';
import {LayerType} from '@/components/interactive-parallax';

export const layersData: LayerType[] = [
    {
        src: ekosistemaSmeshanniiLes.fon[1],
        className: 'sad-layer-1',
        width: 1280,
    },
    {
        src: ekosistemaSmeshanniiLes.fon[2],
        className: 'sad-layer-2',
        width: 1440,
    },
    {
        src: ekosistemaSmeshanniiLes.fon[3],
        className: 'sad-layer-3',
        width: 1600,
        objectsNamesBefore: ['trava2'],
        objectsNames: ['beryozaMini', 'yelFonovaya', 'volk', 'lisa'],
        transform: 'translateX(10%)',
    },
    {
        src: ekosistemaSmeshanniiLes.fon[4],
        className: 'sad-layer-4',
        width: 1760,
        transform: 'translateX(10%)',
    },
    {
        src: ekosistemaSmeshanniiLes.fon[5],
        className: 'sad-layer-5',
        width: 1920,
        objectsNames: ['yel', 'beryoza2Lisaya', 'trutovik'],
        transform: 'translateX(10%)',
    },
    {
        src: ekosistemaSmeshanniiLes.fon[6],
        className: 'sad-layer-6',
        width: 2080,
        objectsNamesBefore: ['trava1'],
        objectsNames: ['beryoza1Lisaya', 'duplo1', 'belka', 'grib', 'zayats', 'lyagushka', 'zmeya'],
        transform: 'translateX(9%)',
    },
    {
        src: ekosistemaSmeshanniiLes.fon[7],
        className: 'sad-layer-7',
        width: 2080,
    },
    {
        src: ekosistemaSmeshanniiLes.fon[8],
        className: 'sad-layer-8',
        width: 2560,
        objectsNames: ['golub'],
    }
];
