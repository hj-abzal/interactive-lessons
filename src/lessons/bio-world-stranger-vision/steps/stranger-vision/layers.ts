import mirGlazamiDrugikh from '@/codgen/mirGlazamiDrugikh';
import {LayerType} from '@/components/interactive-parallax';
import {VisionDescType} from '../../scenarios/train-1/tasks-data';

export const layersDataSad: LayerType[] = [
    {
        src: mirGlazamiDrugikh.sad[1],
        className: 'sad-layer-1',
        width: 1280,
        objectsNames: [VisionDescType.Gecko],
    },
    {
        src: mirGlazamiDrugikh.sad[2],
        className: 'sad-layer-2',
        width: 1440,
    },
    {
        src: mirGlazamiDrugikh.sad[3],
        className: 'sad-layer-3',
        width: 1600,
    },
    {
        src: mirGlazamiDrugikh.sad[4],
        className: 'sad-layer-4',
        width: 1760,
        objectsNames: [VisionDescType.Eagle + '4'],
    },
    {
        src: mirGlazamiDrugikh.sad[5],
        className: 'sad-layer-5',
        width: 1920,
        objectsNames: [VisionDescType.Eagle + '5'],
    },
    {
        src: mirGlazamiDrugikh.sad[6],
        className: 'sad-layer-6',
        width: 2080,
        objectsNames: ['kot', 'pchela', 'delfin', 'riba', 'tsvetok', 'tsvetokUltrafiolet', VisionDescType.Eagle + '6'],
    },
    {
        src: mirGlazamiDrugikh.sad[7],
        className: 'sad-layer-7',
        opacity: 0.7,
        width: 2080,
    },
    {
        src: mirGlazamiDrugikh.sad[8],
        className: 'sad-layer-8',
        width: 2560,
        objectsNames: ['golub'],
    }
];

export const layersDataUnderwater: LayerType[] = [
    {
        src: mirGlazamiDrugikh.prud[1],
        className: 'sad-layer-1',
        width: 1280,
    },
    {
        src: mirGlazamiDrugikh.prud[2],
        className: 'sad-layer-2',
        width: 1440,
    },
    {
        src: mirGlazamiDrugikh.prud[3],
        className: 'sad-layer-3',
        width: 1600,
        objectsNames: [VisionDescType.Shrimps + '3'],
    },
    {
        src: mirGlazamiDrugikh.prud[4],
        className: 'sad-layer-4',
        width: 1760,
    },
    {
        src: mirGlazamiDrugikh.prud[5],
        className: 'sad-layer-5',
        width: 1920,
        objectsNames: [VisionDescType.Shrimps + '5'],
    },
    {
        src: mirGlazamiDrugikh.prud[6],
        className: 'sad-layer-6',
        width: 2080,
        objectsNames: ['riba'],
    },
    {
        src: mirGlazamiDrugikh.prud[7],
        className: 'sad-layer-7',
        opacity: 0.7,
        width: 1280,
        objectsNames: [VisionDescType.Clam, VisionDescType.Shrimps],
    }
];
