/* eslint-disable max-len */
import {random} from 'lodash';
import {
    AtomType, Coord, Pos, DragListener,
    DragModifier, OnDragStartArgs, OnDragEndArgs, OnDragMoveArgs,
    DragUpdater,
    EnvType
} from '@/components/membrane/types';
import {CollisionGetter} from '@/components/membrane/context';
import overlap from 'rectangle-overlap';
import {getCurvePoints} from '@/components/membrane/getCurvePoints';
import i18n from 'i18next';

export const defaultDragListenersReplicas = {
    checkNearMembrane: 'Пожалуйста, перетащи объект в пространство среды',
    checkGradient: 'Пожалуйста, посчитай, где молекул больше, и перенеси молекулы из этой области в ту, где их меньше',
    checkWrongElement: 'Выбери правильную молекулу',
    checkOutsideAquaporin: 'Сперва уравняй молекулы без посредников.',
    checkInsideAquaporin: 'Пожалуйста, используй аквапорин',
    moveCloseToProteinCanal: 'Пожалуйста, посчитай, где молекул больше, и перенеси молекулы из этой области в ту, где их меньше',
    moveCloseToProteinCanal2: 'Обрати внимание, протеин-канал работает только в одну сторону',
    moveCloseToCarrierCanal: 'Пожалуйста, посчитай, где молекул больше, и перенеси молекулы из этой области в ту, где их меньше',
    moveCloseToPump1: 'Обрати внимание, белок-насос работает против градиента концентрации',
    moveCloseToPump2: 'Отлично! А теперь перетащи 2 иона калия из внеклеточной среды к белку-насосу.',
};

export const atomSize: Record<AtomType, Coord> = {
    oxygen: {x: 30, y: 30},
    water: {x: 30, y: 30},
    sodium: {x: 30, y: 30},
    na: {x: 30, y: 30},
    k: {x: 30, y: 30},
    glucose: {x: 145 / 3, y: 85 / 3},
    potassium: {x: 30, y: 30},
    bacterium: {x: 150, y: 100},
    undigested: {x: 150, y: 100},
};

export function getRandomCoordinates(rectBoundaries: Pos) {
    return {x: random(rectBoundaries.x, rectBoundaries.x + rectBoundaries.width),
        y: random(rectBoundaries.y, rectBoundaries.y + rectBoundaries.height)};
}

export function isImageElement(element: HTMLElement): element is HTMLImageElement {
    return element.tagName === 'IMG';
}

export async function getElementRect(element: HTMLElement) {
    if (isImageElement(element) && !(element.complete && element.naturalHeight !== 0)) {
        return new Promise((resolve, reject) => {
            element.addEventListener('load', resolve);
            element.addEventListener('error', reject);
        })
            .then(() => element.getBoundingClientRect());
    }

    return element.getBoundingClientRect();
}

const AVOID_AREA_WIDTH = 380;

export function addPadding(pos: Pos, padding: number, envType): Pos {
    if (envType === 'inner') {
        return {
            x: pos.x + padding + AVOID_AREA_WIDTH,
            y: pos.y + padding,
            width: pos.width - AVOID_AREA_WIDTH - padding * 2,
            height: pos.height - padding * 2,
        };
    } else {
        return {
            x: pos.x + padding,
            y: pos.y + padding,
            width: pos.width - AVOID_AREA_WIDTH - padding * 2,
            height: pos.height - padding * 2,
        };
    }
}

function conformGradient(oldEnv: EnvType, newEnv: EnvType, oldEnvs: EnvType[]) {
    if (oldEnv === newEnv) {
        return true;
    }

    let oldInner = 0;
    let oldOuter = 0;

    for (let index = 0; index < oldEnvs.length; index++) {
        const oldEnv = oldEnvs[index];

        if (oldEnv === 'inner') {
            oldInner++;
        } else {
            oldOuter++;
        }
    }

    if (
        (newEnv === 'inner' && oldInner >= oldOuter) ||
        (newEnv === 'outer' && oldInner <= oldOuter)
    ) {
        return false;
    }

    return true;
}

export const collisionRules = {
    inner: {
        level: 0,
        minX: 1,
        minY: 50,
    },
    outer: {
        level: 1,
        minX: 1,
        minY: 50,
    },
    membrane: {
        level: 2,
        minX: 1,
        minY: 1,
    },
    aquaporin: {
        level: 3,
        minX: 60,
        minY: 1,
    },
    'protein-canal': {
        level: 4,
        minX: 60,
        minY: 1,
    },
    'protein-canal-top': {
        level: 5,
        minX: 1,
        minY: 1,
    },
    'protein-canal-bottom': {
        level: 5,
        minX: 1,
        minY: 1,
    },
    'sinaps-na-canal': {
        level: 4,
        minX: 60,
        minY: 1,
    },
    'sinaps-na-canal-top': {
        level: 5,
        minX: 1,
        minY: 1,
    },
    'sinaps-na-canal-bottom': {
        level: 5,
        minX: 60,
        minY: 1,
    },
    'sinaps-k-canal': {
        level: 4,
        minX: 60,
        minY: 1,
    },
    'sinaps-k-canal-top': {
        level: 5,
        minX: 60,
        minY: 1,
    },
    'sinaps-k-canal-bottom': {
        level: 5,
        minX: 1,
        minY: 1,
    },
    'protein-carrier': {
        level: 4,
        minX: 60,
        minY: 1,
    },
    'protein-carrier-top': {
        level: 5,
        minX: 1,
        minY: 1,
    },
    'protein-carrier-bottom': {
        level: 5,
        minX: 1,
        minY: 1,
    },
    pump: {
        level: 4,
        minX: 60,
        minY: 1,
    },
    'pump-top': {
        level: 5,
        minX: 1,
        minY: 1,
    },
    'pump-bottom': {
        level: 5,
        minX: 1,
        minY: 1,
    },
    'protein-symporter': {
        level: 4,
        minX: 60,
        minY: 1,
    },
    'protein-symporter-top': {
        level: 5,
        minX: 1,
        minY: 1,
    },
    'protein-symporter-bottom': {
        level: 5,
        minX: 1,
        minY: 1,
    },
};

export const clampToBackground = (function createClampToBackground(): DragModifier {
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    let rect = {x: 0, y: 0, width: 0, height: 0};

    function onDragStart(args: OnDragStartArgs) {
        const {refs, meta} = args;
        const inner = refs.current.inner.getBoundingClientRect();
        const outer = refs.current.outer.getBoundingClientRect();
        const type = meta?.type as string | undefined;

        if (!type) {
            return;
        }

        const size = atomSize[type].x;

        minX = inner.left;
        maxX = inner.right - size;
        minY = outer.top;
        maxY = inner.bottom - size;
        rect = args.rect;
    }

    function modifier(oldTransform, diff) {
        return {x: Math.max(minX,
            Math.min(maxX, rect.x + oldTransform.x + diff.x)) - rect.x - oldTransform.x,
        y: Math.max(minY,
            Math.min(maxY, rect.y + oldTransform.y + diff.y)) - oldTransform.y - rect.y};
    }

    return {modifier, onDragStart};
})();

export const clampToEnvironment = (function createClampToEnvironment(): DragModifier {
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    let rect = {x: 0, y: 0, width: 0, height: 0};

    function onDragStart(args: OnDragStartArgs) {
        const {refs, meta} = args;
        const envs = {
            inner: refs.current.inner.getBoundingClientRect(),
            outer: refs.current.outer.getBoundingClientRect(),
        };
        const type = meta?.type as string | undefined;
        const envType = meta?.envType as EnvType;

        if (!type || !envType) {
            return;
        }

        const size = atomSize[type].x;

        minX = envs[envType].left;
        maxX = envs[envType].right - size;
        minY = envs[envType].top;
        maxY = envs[envType].bottom - size;
        rect = args.rect;
    }

    function modifier(oldTransform, diff) {
        return {x: Math.max(minX,
            Math.min(maxX, rect.x + oldTransform.x + diff.x)) - rect.x - oldTransform.x,
        y: Math.max(minY,
            Math.min(maxY, rect.y + oldTransform.y + diff.y)) - oldTransform.y - rect.y};
    }

    return {modifier, onDragStart};
})();

export function createCheckNearMembrane(replicas: typeof defaultDragListenersReplicas, onMistake: () => void): DragListener {
    let lastDrop: string | undefined;

    function onDragStart() {
        lastDrop = undefined;
    }

    function onDragMove(args: OnDragMoveArgs) {
        const {dropMeta} = args;

        if (!dropMeta?.type || dropMeta.type === lastDrop) {
            return;
        }

        lastDrop = dropMeta.type as string;
    }

    function onDragEnd(args: OnDragEndArgs) {
        const {actions} = args;

        if (lastDrop === 'membrane' && replicas.checkNearMembrane) {
            actions.current.sendMessage({text: i18n.t(replicas.checkNearMembrane)});
            onMistake();
        }
    }

    return {onDragStart, onDragMove, onDragEnd};
}

export function createCheckGradient(replicas: typeof defaultDragListenersReplicas, onMistake: () => void, wrongElements): DragListener {
    function onDragEnd(args: OnDragEndArgs) {
        const {oldAtoms, newAtom, oldAtom, actions} = args;

        const filteredElements = oldAtoms.current.filter(
            (atom) => !wrongElements.includes(atom.meta.type));

        if (!conformGradient(
            oldAtom.meta.envType as EnvType,
            newAtom.meta.envType as EnvType,
            filteredElements.map((atom) => atom.meta.envType as EnvType)
        )
        && replicas.checkGradient) {
            actions.current.sendMessage({text: i18n.t(replicas.checkGradient)});
            onMistake();
        }
    }

    return {onDragEnd};
}

export function createCheckWrongElement(
    replicas: typeof defaultDragListenersReplicas,
    onMistake: () => void,
    wrongElements: string[]
): DragListener {
    function onDragEnd(args: OnDragEndArgs) {
        const {newAtom, oldAtom, actions} = args;

        if (
            oldAtom.meta.envType !== newAtom.meta.envType
            && wrongElements.includes(newAtom.meta.type as string)
            && replicas.checkWrongElement
        ) {
            actions.current.sendMessage({text: i18n.t(replicas.checkWrongElement)});
            onMistake();
        }
    }

    return {onDragEnd};
}

export const speedUpAquaporin = (function createSpeedUpAquaporin(): DragModifier {
    let isOver = false;

    function onDragStart() {
        isOver = false;
    }

    function onDragMove(args: OnDragMoveArgs) {
        const {dropMeta} = args;

        if (dropMeta && dropMeta.type === 'aquaporin') {
            isOver = true;
        } else {
            isOver = false;
        }
    }

    function modifier(_, diff) {
        return {x: isOver ? diff.x * 1.5 : diff.x,
            y: isOver ? diff.y * 1.5 : diff.y};
    }

    return {onDragStart, onDragMove, modifier};
})();

export const slowDownAquaporin = (function createSlowDownAquaporin(): DragModifier {
    let isOver = false;

    function onDragStart() {
        isOver = false;
    }

    function onDragMove(args: OnDragMoveArgs) {
        const {dropMeta} = args;

        if (dropMeta && dropMeta.type === 'membrane') {
            isOver = true;
        } else {
            isOver = false;
        }
    }

    function modifier(_, diff) {
        return {x: isOver ? diff.x * 0.6 : diff.x,
            y: isOver ? diff.y * 0.6 : diff.y};
    }

    return {onDragStart, onDragMove, modifier};
})();

export function createCheckOutsideAquaporin(replicas: typeof defaultDragListenersReplicas, onMistake: () => void): DragListener {
    let wasOver = false;

    function onDragStart() {
        wasOver = false;
    }

    function onDragMove(args: OnDragMoveArgs) {
        const {dropMeta} = args;

        if (dropMeta && dropMeta.type === 'aquaporin') {
            wasOver = true;
        }
    }

    function onDragEnd(args: OnDragEndArgs) {
        const {actions} = args;

        if (wasOver && replicas.checkOutsideAquaporin) {
            actions.current.sendMessage({text: i18n.t(replicas.checkOutsideAquaporin)});
            onMistake();
        }
    }

    return {onDragStart, onDragMove, onDragEnd};
}

export function createCheckInsideAquaporin(replicas: typeof defaultDragListenersReplicas, onMistake: () => void): DragListener {
    let wasOver = false;

    function onDragStart() {
        wasOver = false;
    }

    function onDragMove(args: OnDragMoveArgs) {
        const {dropMeta} = args;

        if (dropMeta && dropMeta.type === 'membrane') {
            wasOver = true;
        }
    }

    function onDragEnd(args: OnDragEndArgs) {
        const {actions} = args;

        if (wasOver && replicas.checkInsideAquaporin) {
            actions.current.sendMessage({text: i18n.t(replicas.checkInsideAquaporin)});
            onMistake();
        }
    }

    return {onDragStart, onDragMove, onDragEnd};
}

export function createMoveCloseToProteinCanal(replicas: typeof defaultDragListenersReplicas, onMistake: () => void): DragListener {
    function onDragEnd(args: OnDragEndArgs) {
        const {dropMeta, refs, setAtoms, newAtom, oldAtoms, actions} = args;

        const type = dropMeta?.type as EnvType;

        if (
            ['sinaps-k-canal', 'sinaps-k-canal-top', 'sinaps-k-canal-bottom'].includes(type)
            || (['sinaps-na-canal', 'sinaps-na-canal-top', 'sinaps-na-canal-bottom'].includes(type)
                && !dropMeta?.open
            )
        ) {
            return;
        }

        if (newAtom.meta.envType === 'inner') {
            if (replicas.moveCloseToProteinCanal2) {
                actions.current.sendMessage({text: i18n.t(replicas.moveCloseToProteinCanal2)});
                onMistake();
            }
            return;
        }

        if (
            dropMeta && (
                (newAtom.meta.envType === 'outer' && [
                    'protein-canal-top',
                    'protein-canal',
                    'sinaps-na-canal-top',
                    'sinaps-na-canal'
                ].includes(type)) ||
                (newAtom.meta.envType === 'inner' && [
                    'protein-canal-bottom',
                    'protein-canal',
                    'sinaps-na-canal-bottom',
                    'sinaps-na-canal'
                ].includes(type))
            )
        ) {
            const atom = refs.current[newAtom.id];
            let canal = refs.current[dropMeta.parentId as string];

            if (!canal) {
                canal = refs.current[dropMeta.id as string];
            }

            if (!atom || !canal) {
                throw new Error('No atom or canal was found in refs! Searched by id');
            }

            const atomCoord = newAtom.coords;
            const innerRect = refs.current.inner.getBoundingClientRect();
            const outerRect = refs.current.outer.getBoundingClientRect();
            const membraneRect = refs.current.membrane.getBoundingClientRect();
            const outerPos: Pos = {x: 0, y: 0, height: membraneRect.y - outerRect.y, width: outerRect.width};
            const innerPos: Pos = {
                x: 0, y: outerPos.height + outerPos.y + membraneRect.height,
                height: innerRect.bottom - membraneRect.bottom, width: innerRect.width,
            };
            const canalRect = canal.getBoundingClientRect();
            const canalCoord = {
                x: canalRect.x - outerRect.x + canalRect.width / 2,
                y: canalRect.y - outerRect.y + canalRect.height / 2,
            };

            const halfSize = atomSize[newAtom.meta.type as string].x / 2;

            const finalCoord = getRandomCoordinates(
                addPadding(newAtom.meta.envType === 'outer'
                    ? innerPos
                    : outerPos
                , halfSize, newAtom.meta.envType)
            );

            const points = getCurvePoints([
                atomCoord.x, atomCoord.y,
                canalCoord.x, atomCoord.y,
                canalCoord.x, finalCoord.y,
                finalCoord.x, finalCoord.y
            ]);

            let index = 0;

            const animationFrame = () => {
                if (!canal.setMeta) {
                    throw new Error('setMeta was not passed with canal ref!');
                }

                if (!atom.setCoords) {
                    throw new Error('setCoords was not passed with atom ref!');
                }

                if (typeof points[index] !== 'number') {
                    const envType = newAtom.meta.envType === 'outer' ? 'inner' : 'outer';

                    if (!conformGradient(
                        newAtom.meta.envType as EnvType,
                        envType as EnvType,
                        oldAtoms.current.map((atom) => atom.meta.envType as EnvType)
                    ) && replicas.moveCloseToProteinCanal) {
                        actions.current.sendMessage({text: i18n.t(replicas.moveCloseToProteinCanal)});
                        onMistake();
                    }

                    setAtoms((old) => old.map((old) => old.id === newAtom.id
                        ? ({
                            ...old,
                            coords: {x: points[index - 2], y: points[index - 1]},
                            meta: {...old.meta, envType},
                        })
                        : old));

                    if (!type.includes('sinaps')) {
                        canal.setMeta((old) => ({...old, open: false}));
                    }

                    return;
                }

                if (index === 0) {
                    canal.setMeta((old) => ({...old, open: true}));
                }

                atom.setCoords({x: points[index], y: points[index + 1]});

                index += 2;

                requestAnimationFrame(animationFrame);
            };

            requestAnimationFrame(animationFrame);
        }
    }

    return {onDragEnd};
}

export function createMoveCloseToProteinCanalInverse(replicas: typeof defaultDragListenersReplicas, onMistake: () => void): DragListener {
    function onDragEnd(args: OnDragEndArgs) {
        const {dropMeta, refs, setAtoms, newAtom, oldAtoms, actions} = args;

        const type = dropMeta?.type as EnvType;

        if (
            !['sinaps-k-canal', 'sinaps-k-canal-top', 'sinaps-k-canal-bottom'].includes(type)
            || !dropMeta?.open || newAtom.meta.type !== 'potassium'
        ) {
            return;
        }

        if (newAtom.meta.envType === 'outer') {
            if (replicas.moveCloseToProteinCanal2) {
                actions.current.sendMessage({text: i18n.t(replicas.moveCloseToProteinCanal2)});
                onMistake();
            }
            return;
        }

        if (
            dropMeta && (
                (newAtom.meta.envType === 'outer' && [
                    'sinaps-k-canal-top',
                    'sinaps-k-canal',
                    'sinaps-k-canal-bottom',
                    'sinaps-k-canal'
                ].includes(type)) ||
                (newAtom.meta.envType === 'inner' && [
                    'sinaps-k-canal-bottom',
                    'sinaps-k-canal',
                    'sinaps-k-canal-top',
                    'sinaps-k-canal'
                ].includes(type))
            )
        ) {
            const atom = refs.current[newAtom.id];
            let canal = refs.current[dropMeta.parentId as string];

            if (!canal) {
                canal = refs.current[dropMeta.id as string];
            }

            if (!atom || !canal) {
                throw new Error('No atom or canal was found in refs! Searched by id');
            }

            const atomCoord = newAtom.coords;
            const innerRect = refs.current.inner.getBoundingClientRect();
            const outerRect = refs.current.outer.getBoundingClientRect();
            const membraneRect = refs.current.membrane.getBoundingClientRect();
            const outerPos: Pos = {x: 0, y: 0, height: membraneRect.y - outerRect.y, width: outerRect.width};

            const innerPos: Pos = {
                x: 0, y: outerPos.height + outerPos.y + membraneRect.height,
                height: innerRect.bottom - membraneRect.bottom, width: innerRect.width,
            };

            const canalRect = canal.getBoundingClientRect();

            const canalCoord = {
                x: canalRect.x - outerRect.x + canalRect.width / 2,
                y: canalRect.y - outerRect.y + canalRect.height / 2,
            };

            const halfSize = atomSize[newAtom.meta.type as string].x / 2;

            const finalCoord = getRandomCoordinates(
                addPadding(newAtom.meta.envType === 'outer'
                    ? innerPos
                    : outerPos
                , halfSize, newAtom.meta.envType)
            );

            const points = getCurvePoints([
                atomCoord.x, atomCoord.y,
                canalCoord.x, atomCoord.y,
                canalCoord.x, finalCoord.y,
                finalCoord.x, finalCoord.y
            ]);

            let index = 0;

            const animationFrame = () => {
                if (!canal.setMeta) {
                    throw new Error('setMeta was not passed with canal ref!');
                }

                if (!atom.setCoords) {
                    throw new Error('setCoords was not passed with atom ref!');
                }

                if (typeof points[index] !== 'number') {
                    const envType = newAtom.meta.envType === 'outer' ? 'inner' : 'outer';

                    if (!conformGradient(
                        newAtom.meta.envType as EnvType,
                        envType as EnvType,
                        oldAtoms.current.map((atom) => atom.meta.envType as EnvType)
                    ) && replicas.moveCloseToProteinCanal) {
                        actions.current.sendMessage({text: i18n.t(replicas.moveCloseToProteinCanal)});
                        onMistake();
                    }

                    setAtoms((old) => old.map((old) => old.id === newAtom.id
                        ? ({
                            ...old,
                            coords: {x: points[index - 2], y: points[index - 1]},
                            meta: {...old.meta, envType},
                        })
                        : old));

                    if (!type.includes('sinaps')) {
                        canal.setMeta((old) => ({...old, open: false}));
                    }

                    return;
                }

                if (index === 0) {
                    canal.setMeta((old) => ({...old, open: true}));
                }

                atom.setCoords({x: points[index], y: points[index + 1]});

                index += 2;

                requestAnimationFrame(animationFrame);
            };

            requestAnimationFrame(animationFrame);
        }
    }

    return {onDragEnd};
}

export function createMoveCloseToCarrierCanal(replicas: typeof defaultDragListenersReplicas, onMistake: () => void): DragListener {
    function onDragEnd(args: OnDragEndArgs) {
        const {dropMeta, refs, setAtoms, newAtom, oldAtoms, actions} = args;

        const type = dropMeta?.type as EnvType;

        if (
            dropMeta && (
                (newAtom.meta.envType === 'outer' && ['protein-carrier-top', 'protein-carrier'].includes(type)) ||
                (newAtom.meta.envType === 'inner' && ['protein-carrier-bottom', 'protein-carrier'].includes(type))
            )
        ) {
            const atom = refs.current[newAtom.id];
            let canal = refs.current[dropMeta.parentId as string];

            if (!canal) {
                canal = refs.current[dropMeta.id as string];
            }

            if (!atom || !canal) {
                throw new Error('No atom or canal was found in refs! Searched by id');
            }

            const atomCoord = newAtom.coords;
            const innerRect = refs.current.inner.getBoundingClientRect();
            const outerRect = refs.current.outer.getBoundingClientRect();
            const membraneRect = refs.current.membrane.getBoundingClientRect();
            const outerPos: Pos = {x: 0, y: 0, height: membraneRect.y - outerRect.y, width: outerRect.width};
            const innerPos: Pos = {
                x: 0, y: outerPos.height + outerPos.y + membraneRect.height,
                height: innerRect.bottom - membraneRect.bottom, width: innerRect.width,
            };
            const canalRect = canal.getBoundingClientRect();
            const canalCoord = {
                x: canalRect.x - outerRect.x + canalRect.width / 2,
                y: canalRect.y - outerRect.y + canalRect.height / 2,
            };

            const halfSize = atomSize[newAtom.meta.type as string].x / 2;

            const finalCoord = getRandomCoordinates(
                addPadding(newAtom.meta.envType === 'outer'
                    ? innerPos
                    : outerPos
                , halfSize, newAtom.meta.envType)
            );

            const points1 = getCurvePoints([
                atomCoord.x, atomCoord.y,
                canalCoord.x, atomCoord.y,
                canalCoord.x, canalCoord.y
            ]);

            const points2 = getCurvePoints([
                canalCoord.x, canalCoord.y,
                canalCoord.x, finalCoord.y,
                finalCoord.x, finalCoord.y
            ]);

            let index = 0;

            const animationFrame2 = () => {
                if (!atom.setCoords) {
                    throw new Error('setCoords was not passed with atom ref!');
                }

                if (typeof points2[index] !== 'number') {
                    const envType = newAtom.meta.envType === 'outer' ? 'inner' : 'outer';

                    if (!conformGradient(
                        newAtom.meta.envType as EnvType,
                        envType as EnvType,
                        oldAtoms.current.map((atom) => atom.meta.envType as EnvType)
                    ) && replicas.moveCloseToCarrierCanal) {
                        actions.current.sendMessage({text: i18n.t(replicas.moveCloseToCarrierCanal)});
                        onMistake();
                    }

                    setAtoms((old) => old.map((old) => old.id === newAtom.id
                        ? ({
                            ...old,
                            coords: {x: points2[index - 2], y: points2[index - 1]},
                            meta: {...old.meta, envType},
                        })
                        : old));

                    return;
                }

                atom.setCoords({x: points2[index], y: points2[index + 1]});

                requestAnimationFrame(animationFrame2);

                index += 2;
            };

            const animationFrame1 = () => {
                if (!atom.setCoords) {
                    throw new Error('setCoords was not passed with atom ref!');
                }

                if (typeof points1[index] !== 'number') {
                    index = 0;
                    setTimeout(animationFrame2, 500);

                    return;
                }

                atom.setCoords({x: points1[index], y: points1[index + 1]});

                requestAnimationFrame(animationFrame1);

                index += 2;
            };

            requestAnimationFrame(animationFrame1);
        }
    }

    return {onDragEnd};
}

export function createMoveCloseToPump(replicas: typeof defaultDragListenersReplicas, onMistake: () => void): DragListener {
    function onDragEnd(args: OnDragEndArgs) {
        const {newAtom, oldAtom, dropMeta, oldAtoms, actions, refs, setAtoms} = args;

        const type = dropMeta?.type as EnvType;

        if (
            !dropMeta || (
                !(newAtom.meta.envType === 'outer' && ['pump-top', 'pump'].includes(type)) &&
                !(newAtom.meta.envType === 'inner' && ['pump-bottom', 'pump'].includes(type))
            )
        ) {
            return;
        }

        if (newAtom.meta.type === 'sodium') {
            if ([0, 1, 2].includes(dropMeta.step as number)) {
                if (conformGradient(
                    newAtom.meta.envType as EnvType,
                    newAtom.meta.envType === 'outer' ? 'inner' : 'outer',
                    oldAtoms.current
                        .filter((atom) => atom.meta.type === newAtom.meta.type)
                        .map((atom) => atom.meta.envType as EnvType)
                )) {
                    if (replicas.moveCloseToPump1) {
                        actions.current.sendMessage({text:
                            i18n.t(replicas.moveCloseToPump1),
                        });
                        onMistake();
                    }
                    return;
                }

                const coords = {0: {x: 50, y: 37}, 1: {x: 50, y: 59}, 2: {x: 50, y: 80}};

                let canal = refs.current[dropMeta.parentId as string];

                if (!canal) {
                    canal = refs.current[dropMeta.id as string];
                }

                if (!canal) {
                    throw new Error('canal ref was not found!');
                }

                const atomCoord = newAtom.coords;
                const outerRect = refs.current.outer.getBoundingClientRect();
                const canalRect = canal.getBoundingClientRect();
                const finalCoord = {
                    x: canalRect.x - outerRect.x + canalRect.width * coords[dropMeta.step as number].x / 100,
                    y: canalRect.y - outerRect.y + canalRect.height * coords[dropMeta.step as number].y / 100,
                };

                const middleCoord = {x: finalCoord.x, y: atomCoord.y};

                const points = getCurvePoints([
                    atomCoord.x, atomCoord.y,
                    middleCoord.x, middleCoord.y,
                    finalCoord.x, finalCoord.y
                ], 0.5, 10);

                const atom = refs.current[newAtom.id];

                let index = 0;

                const animationFrame = () => {
                    if (!atom.setCoords) {
                        throw new Error('setCoords was not passed with atom ref!');
                    }

                    if (!canal.setMeta) {
                        throw new Error('setMeta was not passed with canal ref!');
                    }

                    if (typeof points[index] !== 'number') {
                        setAtoms((old) => old.map((old) => old.id === newAtom.id
                            ? ({
                                ...old,
                                coords: finalCoord,
                            })
                            : old));

                        canal.setMeta((old) => ({
                            ...old,
                            step: (<number>dropMeta.step + 1) % 7,
                            atomIds: [...<string[]>old.atomIds, newAtom.id],
                        }));

                        if (dropMeta.step === 2) {
                            let innerIndex = 0;

                            const atomIds: string[] = [
                                ...(<string[]>dropMeta.atomIds),
                                newAtom.id
                            ];

                            const atoms = atomIds.map((id) => refs.current[id]);

                            const innerRect = refs.current.inner.getBoundingClientRect();
                            const outerRect = refs.current.outer.getBoundingClientRect();
                            const membraneRect = refs.current.membrane.getBoundingClientRect();
                            const outerPos: Pos = {x: 0, y: 0,
                                height: membraneRect.y - outerRect.y, width: outerRect.width};
                            const innerPos: Pos = {
                                x: 0, y: outerPos.height + outerPos.y + membraneRect.height,
                                height: innerRect.bottom - membraneRect.bottom, width: innerRect.width,
                            };

                            const innerPoints = atomIds
                                .map((id) => oldAtoms.current.find((a) => a.id === id))
                                .map((atomInfo) => {
                                    if (!atomInfo) {
                                        throw new Error('atom info was not found!');
                                    }

                                    const halfSize = atomSize[atomInfo.meta.type as string].x / 2;

                                    const atomCoord = atomInfo.coords;

                                    const finalCoord = getRandomCoordinates(
                                        addPadding(newAtom.meta.envType === 'outer'
                                            ? innerPos
                                            : outerPos
                                        , halfSize, newAtom.meta.envType)
                                    );

                                    return getCurvePoints([
                                        atomCoord.x, atomCoord.y,
                                        atomCoord.x, finalCoord.y,
                                        finalCoord.x, finalCoord.y
                                    ]);
                                });

                            const innerAnimationFrame = () => {
                                if (!canal.setMeta) {
                                    throw new Error('setMeta was not passed with canal ref!');
                                }

                                if (typeof innerPoints[0][innerIndex] !== 'number') {
                                    setAtoms((old) => old.map((atom) => {
                                        const idIndex = atomIds.indexOf(atom.id);

                                        if (idIndex >= 0) {
                                            return {
                                                ...atom,
                                                coords: {
                                                    x: innerPoints[idIndex][innerIndex - 2],
                                                    y: innerPoints[idIndex][innerIndex - 1],
                                                },
                                                meta: {
                                                    ...atom.meta,
                                                    envType: atom.meta.envType === 'outer' ? 'inner' : 'outer',
                                                },
                                            };
                                        }

                                        return atom;
                                    }));

                                    canal.setMeta((old) => ({
                                        ...old,
                                        step: (<number>dropMeta.step + 2) % 7,
                                        atomIds: [],
                                    }));

                                    if (replicas.moveCloseToPump2) {
                                        actions.current.sendMessage({text: i18n.t(replicas.moveCloseToPump2)});
                                        onMistake();
                                    }

                                    return;
                                }

                                innerPoints.forEach((p, pointsIndex) => {
                                    if (!atoms[pointsIndex].setCoords) {
                                        throw new Error('setCoords was not passed with atom ref!');
                                    }

                                    atoms[pointsIndex].setCoords!({
                                        x: p[innerIndex],
                                        y: p[innerIndex + 1],
                                    });
                                });

                                innerIndex += 2;

                                requestAnimationFrame(innerAnimationFrame);
                            };

                            setTimeout(innerAnimationFrame, 500);
                        }

                        return;
                    }

                    atom.setCoords({x: points[index], y: points[index + 1]});

                    requestAnimationFrame(animationFrame);

                    index += 2;
                };

                requestAnimationFrame(animationFrame);
            } else {
                const points = getCurvePoints([
                    newAtom.coords.x, newAtom.coords.y,
                    oldAtom.coords.x, oldAtom.coords.y
                ]);

                const atom = refs.current[newAtom.id];

                let index = 0;

                const animationFrame = () => {
                    if (!atom.setCoords) {
                        throw new Error('setCoords was not passed with atom ref!');
                    }

                    if (typeof points[index] !== 'number') {
                        setAtoms((old) => old.map((old) => old.id === newAtom.id
                            ? ({
                                ...old,
                                coords: oldAtom.coords,
                            })
                            : old));

                        return;
                    }

                    atom.setCoords({x: points[index], y: points[index + 1]});

                    requestAnimationFrame(animationFrame);

                    index += 2;
                };

                requestAnimationFrame(animationFrame);
            }
        } else if (newAtom.meta.type === 'potassium') {
            if ([4, 5].includes(dropMeta.step as number)) {
                if (conformGradient(
                    newAtom.meta.envType as EnvType,
                    newAtom.meta.envType === 'outer' ? 'inner' : 'outer',
                    oldAtoms.current
                        .filter((atom) => atom.meta.type === newAtom.meta.type)
                        .map((atom) => atom.meta.envType as EnvType)
                )) {
                    if (replicas.moveCloseToPump1) {
                        actions.current.sendMessage({text:
                            i18n.t(replicas.moveCloseToPump1),
                        });
                        onMistake();
                    }

                    return;
                }

                const coords = {4: {x: 49, y: 29}, 5: {x: 49, y: 52}};

                let canal = refs.current[dropMeta.parentId as string];

                if (!canal) {
                    canal = refs.current[dropMeta.id as string];
                }

                if (!canal) {
                    throw new Error('canal ref was not found!');
                }

                const atomCoord = newAtom.coords;
                const outerRect = refs.current.outer.getBoundingClientRect();
                const canalRect = canal.getBoundingClientRect();
                const finalCoord = {
                    x: canalRect.x - outerRect.x + canalRect.width * coords[dropMeta.step as number].x / 100,
                    y: canalRect.y - outerRect.y + canalRect.height * coords[dropMeta.step as number].y / 100,
                };

                const middleCoord = {x: finalCoord.x, y: atomCoord.y};

                const points = getCurvePoints([
                    atomCoord.x, atomCoord.y,
                    middleCoord.x, middleCoord.y,
                    finalCoord.x, finalCoord.y
                ], 0.5, 10);

                const atom = refs.current[newAtom.id];

                let index = 0;

                const animationFrame = () => {
                    if (!atom.setCoords) {
                        throw new Error('setCoords was not passed with atom ref!');
                    }

                    if (!canal.setMeta) {
                        throw new Error('setMeta was not passed with canal ref!');
                    }

                    if (typeof points[index] !== 'number') {
                        setAtoms((old) => old.map((old) => old.id === newAtom.id
                            ? ({
                                ...old,
                                coords: finalCoord,
                            })
                            : old));

                        canal.setMeta((old) => ({
                            ...old,
                            step: (<number>dropMeta.step + 1) % 7,
                            atomIds: [...<string[]>old.atomIds, newAtom.id],
                        }));

                        if (dropMeta.step === 5) {
                            let innerIndex = 0;

                            const atomIds: string[] = [
                                ...(<string[]>dropMeta.atomIds),
                                newAtom.id
                            ];

                            const atoms = atomIds.map((id) => refs.current[id]);

                            const innerRect = refs.current.inner.getBoundingClientRect();
                            const outerRect = refs.current.outer.getBoundingClientRect();
                            const membraneRect = refs.current.membrane.getBoundingClientRect();
                            const outerPos: Pos = {x: 0, y: 0,
                                height: membraneRect.y - outerRect.y, width: outerRect.width};
                            const innerPos: Pos = {
                                x: 0, y: outerPos.height + outerPos.y + membraneRect.height,
                                height: innerRect.bottom - membraneRect.bottom, width: innerRect.width,
                            };

                            const innerPoints = atomIds
                                .map((id) => oldAtoms.current.find((a) => a.id === id))
                                .map((atomInfo) => {
                                    if (!atomInfo) {
                                        throw new Error('atom info was not found!');
                                    }

                                    const halfSize = atomSize[atomInfo.meta.type as string].x / 2;

                                    const atomCoord = atomInfo.coords;

                                    const finalCoord = getRandomCoordinates(
                                        addPadding(newAtom.meta.envType === 'outer'
                                            ? innerPos
                                            : outerPos
                                        , halfSize, newAtom.meta.envType)
                                    );

                                    return getCurvePoints([
                                        atomCoord.x, atomCoord.y,
                                        atomCoord.x, finalCoord.y,
                                        finalCoord.x, finalCoord.y
                                    ]);
                                });

                            const innerAnimationFrame = () => {
                                if (!canal.setMeta) {
                                    throw new Error('setMeta was not passed with canal ref!');
                                }

                                if (typeof innerPoints[0][innerIndex] !== 'number') {
                                    setAtoms((old) => old.map((atom) => {
                                        const idIndex = atomIds.indexOf(atom.id);

                                        if (idIndex >= 0) {
                                            return {
                                                ...atom,
                                                coords: {
                                                    x: innerPoints[idIndex][innerIndex - 2],
                                                    y: innerPoints[idIndex][innerIndex - 1],
                                                },
                                                meta: {
                                                    ...atom.meta,
                                                    envType: atom.meta.envType === 'outer' ? 'inner' : 'outer',
                                                },
                                            };
                                        }

                                        return atom;
                                    }));

                                    canal.setMeta((old) => ({
                                        ...old,
                                        step: (<number>dropMeta.step + 2) % 7,
                                        atomIds: [],
                                    }));

                                    return;
                                }

                                innerPoints.forEach((p, pointsIndex) => {
                                    if (!atoms[pointsIndex].setCoords) {
                                        throw new Error('setCoords was not passed with atom ref!');
                                    }

                                    atoms[pointsIndex].setCoords!({
                                        x: p[innerIndex],
                                        y: p[innerIndex + 1],
                                    });
                                });

                                innerIndex += 2;

                                requestAnimationFrame(innerAnimationFrame);
                            };

                            setTimeout(innerAnimationFrame, 500);
                        }

                        return;
                    }

                    atom.setCoords({x: points[index], y: points[index + 1]});

                    requestAnimationFrame(animationFrame);

                    index += 2;
                };

                requestAnimationFrame(animationFrame);
            } else {
                const points = getCurvePoints([
                    newAtom.coords.x, newAtom.coords.y,
                    oldAtom.coords.x, oldAtom.coords.y
                ]);

                const atom = refs.current[newAtom.id];

                let index = 0;

                const animationFrame = () => {
                    if (!atom.setCoords) {
                        throw new Error('setCoords was not passed with atom ref!');
                    }

                    if (typeof points[index] !== 'number') {
                        setAtoms((old) => old.map((old) => old.id === newAtom.id
                            ? ({
                                ...old,
                                coords: oldAtom.coords,
                            })
                            : old));

                        return;
                    }

                    atom.setCoords({x: points[index], y: points[index + 1]});

                    requestAnimationFrame(animationFrame);

                    index += 2;
                };

                requestAnimationFrame(animationFrame);
            }
        }
    }

    return {onDragEnd};
}

export function createMoveCloseToSymporter(): DragListener {
    function onDragEnd(args: OnDragEndArgs) {
        const {dropMeta, newAtom, refs, setAtoms, oldAtoms, oldAtom} = args;

        const type = dropMeta?.type as EnvType;

        if (
            !dropMeta || (
                !(newAtom.meta.envType === 'outer' && ['protein-symporter-top', 'protein-symporter'].includes(type))
            )
        ) {
            return;
        }

        if (!['sodium', 'glucose'].includes(newAtom.meta.type as string)) {
            return;
        }

        if (
            (<string[]>dropMeta.atomIds)
                .map((atomId) => oldAtoms.current.find((a) => a.id === atomId)?.meta.type)
                .includes(newAtom.meta.type as string)
        ) {
            const points = getCurvePoints([
                newAtom.coords.x, newAtom.coords.y,
                oldAtom.coords.x, oldAtom.coords.y
            ]);

            const atom = refs.current[newAtom.id];

            let index = 0;

            const animationFrame = () => {
                if (!atom.setCoords) {
                    throw new Error('setCoords was not passed with atom ref!');
                }

                if (typeof points[index] !== 'number') {
                    setAtoms((old) => old.map((old) => old.id === newAtom.id
                        ? ({
                            ...old,
                            coords: oldAtom.coords,
                        })
                        : old));

                    return;
                }

                atom.setCoords({x: points[index], y: points[index + 1]});

                requestAnimationFrame(animationFrame);

                index += 2;
            };

            requestAnimationFrame(animationFrame);

            return;
        }

        const coords = {sodium: {x: 50, y: 28}, glucose: {x: 50, y: 52}};

        let canal = refs.current[dropMeta.parentId as string];

        if (!canal) {
            canal = refs.current[dropMeta.id as string];
        }

        if (!canal) {
            throw new Error('canal ref was not found!');
        }

        const atomCoord = newAtom.coords;
        const outerRect = refs.current.outer.getBoundingClientRect();
        const canalRect = canal.getBoundingClientRect();
        const finalCoord = {
            x: canalRect.x - outerRect.x + canalRect.width * coords[newAtom.meta.type as string].x / 100,
            y: canalRect.y - outerRect.y + canalRect.height * coords[newAtom.meta.type as string].y / 100,
        };

        const points = getCurvePoints([
            atomCoord.x, atomCoord.y,
            finalCoord.x, atomCoord.y,
            finalCoord.x, finalCoord.y
        ], 0.5, 10);

        const atom = refs.current[newAtom.id];

        const moveFromProtein = () => {
            const atoms = [newAtom.id, ...<string[]>dropMeta.atomIds].map((atomId) => {
                return oldAtoms.current.find((a) => a.id === atomId)!;
            });

            const membraneRect = refs.current.membrane.getBoundingClientRect();
            const innerRect = refs.current.inner.getBoundingClientRect();

            const outerPos: Pos = {x: 0, y: 0,
                height: membraneRect.y - outerRect.y, width: outerRect.width};
            const innerPos: Pos = {
                x: 0, y: outerPos.height + outerPos.y + membraneRect.height,
                height: innerRect.bottom - membraneRect.bottom, width: innerRect.width,
            };

            const fromPoints = atoms.map((atom) => {
                const halfSize = atomSize[atom.meta.type as string].x / 2;

                const fromFinalCoord = getRandomCoordinates(
                    addPadding(newAtom.meta.envType === 'outer'
                        ? innerPos
                        : outerPos
                    , halfSize, newAtom.meta.envType)
                );

                return getCurvePoints([
                    finalCoord.x, finalCoord.y,
                    finalCoord.x, fromFinalCoord.y,
                    fromFinalCoord.x, fromFinalCoord.y
                ], 0.5, 10);
            });

            let fromIndex = 0;

            const animationFrame = () => {
                if (!atom.setCoords) {
                    throw new Error('setCoords was not passed with atom ref!');
                }

                if (!canal.setMeta) {
                    throw new Error('setMeta was not passed with canal ref!');
                }

                if (typeof fromPoints[0][fromIndex] !== 'number') {
                    setAtoms((old) => old.map((old) => {
                        const atomIndex = atoms.findIndex((a) => old.id === a.id);
                        const atom = atoms[atomIndex];

                        return atom
                            ? ({
                                ...old,
                                coords: {
                                    x: fromPoints[atomIndex][fromPoints[atomIndex].length - 2],
                                    y: fromPoints[atomIndex][fromPoints[atomIndex].length - 1],
                                },
                                meta: {
                                    ...old.meta,
                                    envType: atom.meta.envType === 'outer' ? 'inner' : 'outer',
                                },
                            })
                            : old;
                    }));

                    canal.setMeta((old) => ({
                        ...old,
                        atomIds: [],
                    }));

                    return;
                }

                atoms.forEach((a, atomIndex) => {
                    refs.current[a.id].setCoords?.({
                        x: fromPoints[atomIndex][fromIndex],
                        y: fromPoints[atomIndex][fromIndex + 1],
                    });
                });

                requestAnimationFrame(animationFrame);

                fromIndex += 2;
            };

            requestAnimationFrame(animationFrame);
        };

        let toIndex = 0;

        const moveToProtein = () => {
            if (!atom.setCoords) {
                throw new Error('setCoords was not passed with atom ref!');
            }

            if (!canal.setMeta) {
                throw new Error('setMeta was not passed with canal ref!');
            }

            if (typeof points[toIndex] !== 'number') {
                setAtoms((old) => old.map((old) => old.id === newAtom.id
                    ? ({
                        ...old,
                        coords: finalCoord,
                    })
                    : old));

                canal.setMeta((old) => ({
                    ...old,
                    atomIds: [...<string[]>old.atomIds, newAtom.id],
                }));

                if ((<string[]>dropMeta.atomIds).length === 1) {
                    setTimeout(moveFromProtein, 500);
                }

                return;
            }

            atom.setCoords({x: points[toIndex], y: points[toIndex + 1]});

            requestAnimationFrame(moveToProtein);

            toIndex += 2;
        };

        requestAnimationFrame(moveToProtein);
    }

    return {onDragEnd};
}

export const getCollision: CollisionGetter = function getCollision(drag, dragMeta, drops, dropsMeta) {
    let overlapIndex = -1;

    for (let index = 0; index < drops.length; index++) {
        const drop = drops[index];
        const overlapRect = overlap(drag, drop);

        if (
            overlapRect && (
                overlapIndex >= 0 && (
                    collisionRules[dropsMeta[overlapIndex]?.type as string].level <
                    collisionRules[dropsMeta[index]?.type as string].level &&
                    overlapRect.width >= collisionRules[dropsMeta[index]?.type as string].minX &&
                    overlapRect.height >= collisionRules[dropsMeta[index]?.type as string].minY
                ) || true
            )
        ) {
            overlapIndex = index;
        }
    }

    return overlapIndex;
};

export const updateCoord = (function createUpdateCoord(): DragUpdater {
    function onDragEnd(args: OnDragEndArgs) {
        const {newAtom, transform} = args;

        return {...newAtom, coords: {
            x: newAtom.coords.x + transform.x, y: newAtom.coords.y + transform.y,
        }};
    }

    return {onDragEnd};
})();

export const updateEnvType = (function createUpdateEnvType(): DragUpdater {
    function onDragEnd(args: OnDragEndArgs) {
        const {newAtom, dropMeta} = args;

        if (
            dropMeta &&
            newAtom.meta.envType !== dropMeta.type && ['inner', 'outer'].includes(dropMeta.type as string)
        ) {
            return {...newAtom, meta: {...newAtom.meta, envType: dropMeta.type}};
        }

        return newAtom;
    }

    return {onDragEnd};
})();

export const dragUpdaters = {
    updateCoord,
    updateEnvType,
};

export const dragModifiers = {
    clampToEnvironment,
    slowDownAquaporin,
    clampToBackground,
    speedUpAquaporin,
};

export const dragListenersCreators = {
    checkNearMembrane: createCheckNearMembrane,
    checkGradient: createCheckGradient,
    checkWrongElement: createCheckWrongElement,
    checkOutsideAquaporin: createCheckOutsideAquaporin,
    checkInsideAquaporin: createCheckInsideAquaporin,
    moveCloseToCarrierCanal: createMoveCloseToCarrierCanal,
    moveCloseToProteinCanal: createMoveCloseToProteinCanal,
    moveCloseToProteinCanalInverse: createMoveCloseToProteinCanalInverse,
    moveCloseToPump: createMoveCloseToPump,
    moveCloseToSymproter: createMoveCloseToSymporter,
};
