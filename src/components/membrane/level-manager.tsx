import {useState, useEffect, useRef, useCallback, Fragment} from 'react';
import {AtomInfo, EnvType, Pos, IMembraneState, LevelManagerRef, Coord} from '@/components/membrane/types';
import {
    getRandomCoordinates,
    getElementRect, atomSize, addPadding, getCollision
} from '@/components/membrane/utils';
import {Membrane} from '@/components/membrane/membrane';
import {DnDProvider, DragModifier as ContextDragModifier} from '@/components/membrane/context';
import {Atom} from '@/components/membrane/atom';
import {Inner} from '@/components/membrane/inner';
import {Outer} from '@/components/membrane/outer';
import {isEqual} from 'lodash';
import {useChat} from '@/context-providers/chat';
import {useSmartViewportWrapper} from '@/context-providers/smart-viewport-wrapper';
import _ from 'lodash';

function LevelManagerInner(props: IMembraneState) {
    const {
        currentLevel,
        highlight,
        runStage,
        conditions,
        endConditions,
        conditionsKey,
        onConditionChange,
        images,
    } = props;
    const [atomsKey, setAtomsKey] = useState(conditionsKey);
    const [finished, setFinished] = useState(false);
    const [dragModifiers, setDragModifiers] = useState<ContextDragModifier[]>([]);
    const chat = useChat();

    const actions = useRef({
        sendMessage: chat.sendMessage,
    });
    actions.current = {sendMessage: chat.sendMessage};

    const [atoms, setAtoms] = useState<AtomInfo[]>([]);
    const atomsRef = useRef(atoms);
    atomsRef.current = atoms;

    const {zoom} = useSmartViewportWrapper();
    const zoomRef = useRef(zoom);
    zoomRef.current = zoom;

    const refs = useRef<Record<string, LevelManagerRef>>({});

    const setRef = useCallback((id: string, ref: HTMLElement) => {
        refs.current[id] = ref;
    }, []);

    const unsetRef = useCallback((id: string) => {
        delete refs.current[id];
    }, []);

    useEffect(function initAtoms() {
        setFinished(false);
        let outdated = false;

        (async function asyncInitAtoms() {
            const [
                innerRect, outerRect, membraneRect
            ] = await Promise.all(['inner', 'outer', 'membrane'].map((refId) => {
                const element = refs.current[refId];

                if (!element) {
                    throw new Error(`No element was registered with id ${refId}`);
                }

                return getElementRect(element);
            }));

            if (outdated) {
                return;
            }

            const outerPos: Pos = {x: 0, y: 0, height: membraneRect.y - outerRect.y, width: outerRect.width};
            const innerPos: Pos = {
                x: 0, y: outerPos.height + outerPos.y + membraneRect.height,
                height: innerRect.bottom - membraneRect.bottom, width: innerRect.width,
            };

            const newAtoms: AtomInfo[] = [];

            let id = 0;

            for (const envType of (['inner', 'outer'] as EnvType[])) {
                for (const [type, amount] of Object.entries(conditions[envType])) {
                    const halfSize = atomSize[type].x / 2;

                    for (let index = 0; index < amount; index++) {
                        const {x, y} = getRandomCoordinates(
                            addPadding(
                                envType === 'outer'
                                    ? outerPos
                                    : innerPos,
                                halfSize,
                                envType
                            )
                        );

                        const atomId = `${type}-${id++}`;

                        newAtoms.push({
                            id: atomId,
                            meta: {
                                type: type,
                                envType,
                                id: atomId,
                            },
                            coords: {x, y},
                        });
                    }
                }
            }

            setAtomsKey(conditionsKey);
            setAtoms(newAtoms);
        })();

        return () => {
            outdated = true;
        };
    }, [conditionsKey]);

    useEffect(function initDragModifiers() {
        const newDragModifiers: ContextDragModifier[] = [];

        newDragModifiers.push((_, diff) => ({x: diff.x / zoomRef.current, y: diff.y / zoomRef.current}));

        for (const modifier of currentLevel.dragModifiers) {
            newDragModifiers.push(modifier.modifier);
        }

        setDragModifiers(newDragModifiers);
    }, [currentLevel.dragModifiers]);

    const onDragStart = useCallback(function onDragStart(rect: Pos, meta: Record<string, unknown> | undefined) {
        for (const modifier of currentLevel.dragModifiers) {
            modifier.onDragStart?.({refs: refs, actions, rect, meta});
        }

        for (const listener of currentLevel.dragListeners) {
            listener.onDragStart?.({refs, actions, rect, meta});
        }
    }, [currentLevel.dragModifiers, currentLevel.dragListeners]);

    const onDragMove = useCallback(function onDragMove(
        drag: Pos, dragMeta: Record<string, unknown> | undefined,
        drop: Pos | undefined, dropMeta: Record<string, unknown> | undefined
    ) {
        for (const modifier of currentLevel.dragModifiers) {
            modifier.onDragMove?.({refs, actions, dropMeta});
        }

        for (const listener of currentLevel.dragListeners) {
            listener.onDragMove?.({refs, actions, dropMeta});
        }
    }, [currentLevel.dragModifiers, currentLevel.dragListeners]);

    const onDragEnd = useCallback(function onDragEnd(
        dragMeta: Record<string, unknown> | undefined,
        dropMeta: Record<string, unknown> | undefined,
        transform: Coord
    ) {
        if (!dragMeta?.id || !dropMeta?.type) {
            return;
        }

        const oldAtoms = atomsRef.current;

        const oldAtom = oldAtoms.find((atom) => atom.id === dragMeta.id);

        if (!oldAtom) {
            throw new Error('No old atom was found in the list!');
        }

        let newAtom = {...oldAtom};

        for (const updater of currentLevel.dragUpdaters) {
            if (!updater.onDragEnd) {
                continue;
            }

            newAtom = updater.onDragEnd({
                refs, oldAtoms: atomsRef,
                oldAtom, newAtom, actions,
                transform, dropMeta, setAtoms,
            });
        }

        for (const modifier of currentLevel.dragModifiers) {
            modifier.onDragEnd?.({
                refs, oldAtoms: atomsRef,
                oldAtom, newAtom, actions,
                transform, dropMeta, setAtoms,
            });
        }

        for (const listener of currentLevel.dragListeners) {
            listener.onDragEnd?.({
                refs, oldAtoms: atomsRef,
                oldAtom, newAtom, actions,
                transform, dropMeta, setAtoms,
            });
        }

        const newAtoms = oldAtoms.map((atom) => atom.id === dragMeta.id ? newAtom : atom);

        setAtoms(newAtoms);
    }, [currentLevel.dragModifiers, currentLevel.dragListeners, currentLevel.dragUpdaters]);

    useEffect(function onAtomsUpdate() {
        // console.log('on atoms update', {
        //     conditions,
        //     endConditions,
        // });

        let isMeetConditionsInner = false;

        if (!Object.keys(conditions.inner).length && !Object.keys(endConditions.inner).length) {
            isMeetConditionsInner = true;
        }

        _.mapValues(endConditions.inner, (quantity, elementName) => {
            if (conditions.inner[elementName] === quantity) {
                isMeetConditionsInner = true;
            }
        });

        let isMeetConditionsOuter = false;

        if (!Object.keys(conditions.outer).length && !Object.keys(endConditions.outer).length) {
            isMeetConditionsOuter = true;
        }

        _.mapValues(endConditions.outer, (quantity, elementName) => {
            if (conditions.outer[elementName] === quantity) {
                isMeetConditionsOuter = true;
            }
        });

        // console.log('asdadaffff', {
        //     isMeetConditionsOuter,
        //     isMeetConditionsInner,
        //     nextStageId: currentLevel.nextStageId,
        //     finished,
        //     atomsKey,
        //     conditionsKey,
        // });

        if (
            !finished &&
            atomsKey === conditionsKey &&
            isMeetConditionsInner &&
            isMeetConditionsOuter
        ) {
            setFinished(true);

            if (currentLevel.nextStageId) {
                runStage(currentLevel.nextStageId);
            }
        }
    }, [conditions, endConditions, currentLevel.nextStageId]);

    useEffect(function updateConditions() {
        // console.log('updateConditions', atoms, conditions);

        if (atomsKey !== conditionsKey) {
            return;
        }

        const updateConditions = {
            inner: {},
            outer: {},
        };

        // console.log('updateConditions', {updateConditions});

        for (const atom of atoms) {
            if (!((atom.meta.type as string) in updateConditions[atom.meta.envType as string])) {
                updateConditions[atom.meta.envType as string][atom.meta.type as string] = 0;
            }

            updateConditions[atom.meta.envType as string][atom.meta.type as string]++;
        }

        if (!isEqual(updateConditions, conditions)) {
            onConditionChange(updateConditions);
        }
    }, [atoms, conditions, onConditionChange]);

    return <DnDProvider getCollision={getCollision} dragModifiers={dragModifiers}
        onDragStart={onDragStart} onDragEnd={onDragEnd} onDragMove={onDragMove}>
        <Inner id='inner' setRef={setRef} unsetRef={unsetRef} />
        <Outer id='outer' setRef={setRef} unsetRef={unsetRef} />
        <Membrane
            canalsState={currentLevel.membraneCanalsState}
            images={images} canals={currentLevel.membraneCanals} highlight={highlight}
            id='membrane' setRef={setRef} unsetRef={unsetRef}
        />
        {atoms.map((atomProps) => <Atom
            key={atomProps.id} {...atomProps} setRef={setRef} unsetRef={unsetRef} images={images}
        />)}
    </DnDProvider>;
}

export function LevelManager(props: IMembraneState) {
    const {show} = props;

    if (show) {
        return <LevelManagerInner {...props} />;
    }

    return <Fragment />;
}
