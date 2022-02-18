import mirGlazamiDrugikh from '@/codgen/mirGlazamiDrugikh';
import {LayerObjectType} from '@/components/interactive-parallax/layer-object';
import {VisionDescType} from '@/lessons/bio-world-stranger-vision/scenarios/train-1/tasks-data';

type OptionType = {
    onAnimalClick?: (name: string) => void,
    nativeObjects?: boolean // if true return objects without callback wrapper
}
export const createObjects = ({onAnimalClick, nativeObjects}: OptionType): LayerObjectType[] => {
    const objectsData: LayerObjectType[] = [
        {
            name: VisionDescType.Gecko,
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.sad['1Gekkon'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: VisionDescType.Eagle + '4',
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.sad['4Orel'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: VisionDescType.Eagle + '5',
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.sad['5Orel'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: VisionDescType.Eagle + '6',
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.sad['6Orel'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: VisionDescType.Clam,
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.prud['7Molyusk'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: VisionDescType.Shrimps + '3',
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.prud['3Krevetka'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: VisionDescType.Shrimps,
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.prud['7Krevetka'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: VisionDescType.Shrimps + '5',
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.prud['5Krevetka'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: VisionDescType.Dog,
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.sad['1Gekkon'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: VisionDescType.Heron,
            x: 0,
            y: 0,
            src: mirGlazamiDrugikh.sad['1Gekkon'],
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: 'kot',
            x: 30,
            y: 67.5,
            w: 7,
            src: mirGlazamiDrugikh.kot,
            isUnclickable: false,
            isHidden: true,
        },
        {
            name: 'pchela',
            x: 64,
            y: 60,
            w: 3,
            src: mirGlazamiDrugikh.pchela,
            isUnclickable: false,
            isHidden: true,
        },
        {
            name: 'tsvetok',
            x: 67,
            y: 58,
            w: 7,
            src: mirGlazamiDrugikh.tsvetok,
            isUnclickable: true,
        },
        {
            name: 'tsvetokUltrafiolet',
            x: 67,
            y: 58,
            w: 7,
            src: mirGlazamiDrugikh.tsvetokUltrafiolet,
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: 'delfin',
            x: 46,
            y: 76,
            w: 6,
            src: mirGlazamiDrugikh.delfin,
            isUnclickable: true,
            isHidden: true,
        },
        {
            name: 'riba',
            x: 35,
            y: 90,
            w: 5,
            src: mirGlazamiDrugikh.riba,
            isUnclickable: false,
            isHidden: true,
        },
        {
            name: 'golub',
            x: 45,
            y: 40,
            w: 6,
            src: mirGlazamiDrugikh.golub,
            isUnclickable: false,
        }
    ];

    const clickableObjects = objectsData.map((obj) => {
        if (!obj.isUnclickable) {
            obj.onClick = () => onAnimalClick && onAnimalClick(obj.name!);
        }
        return obj;
    });
    if (nativeObjects) {
        return objectsData;
    }
    return clickableObjects;
};
