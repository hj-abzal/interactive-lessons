import {
    useCallback, MouseEventHandler, useRef, MutableRefObject,
    createContext, useContext, useEffect, useState, PropsWithChildren
} from 'react';
import {Coord, Pos} from '@/components/membrane/types';

export type CollisionGetter = (
    drag: Pos,
    dragMeta: Record<string, unknown> | undefined, drops: Pos[], dropsMeta: (Record<string, unknown> | undefined)[]
) => number;

export type DragModifier = (oldTransform: Coord, diff: Coord, drag: Draggable, drop?: Droppable) => Coord;

interface DnDContextProps {
    getCollision: CollisionGetter;
    dragModifiers: DragModifier[];
    onDragStart?: (drag: Pos, dragMeta: Record<string, unknown> | undefined) => void;
    onDragMove?: (drag: Pos, dragMeta: Record<string, unknown> | undefined,
        drop: Pos | undefined, dropMeta: Record<string, unknown> | undefined) => void;
    onDragEnd?: (
        dragMeta: Record<string, unknown> | undefined,
        dropMeta: Record<string, unknown> | undefined,
        transform: Coord
    ) => void;
}

interface Droppable {
    id: string;
    ref: MutableRefObject<HTMLElement>;
    onStateUpdate: () => void;
    meta?: Record<string, unknown>;
}

interface Draggable {
    id: string;
    ref: MutableRefObject<HTMLElement>;
    onStateUpdate: () => void;
    meta?: Record<string, unknown>;
}

export const DnDContext = createContext<MutableRefObject<{
    onMouseDown: MouseEventHandler<HTMLElement>,
    draggables: MutableRefObject<Record<string, Droppable>>,
    droppables: MutableRefObject<Record<string, Droppable>>,
    draggingId: MutableRefObject<string | null>,
    transform: MutableRefObject<Coord | null>,
    overId: MutableRefObject<string | null>
}>>({current: {
    onMouseDown: () => undefined,
    draggables: {current: {}},
    droppables: {current: {}},
    draggingId: {current: null},
    transform: {current: null},
    overId: {current: null},
}});

export function DnDProvider(props: PropsWithChildren<DnDContextProps>) {
    const droppables = useRef<Record<string, Droppable>>({});
    const draggables = useRef<Record<string, Draggable>>({});

    const draggingId = useRef<string | null>(null);
    const transform = useRef<Coord | null>(null);
    const overId = useRef<string | null>(null);

    const propsRef = useRef(props);
    propsRef.current = props;

    const updateDrag = useCallback((id: string | null) => {
        if (id && id in draggables.current) {
            draggables.current[id].onStateUpdate();
        }
    }, []);

    const updateDrop = useCallback((id: string | null) => {
        if (id && id in droppables.current) {
            droppables.current[id].onStateUpdate();
        }
    }, []);

    const onMouseDown = useCallback<MouseEventHandler<HTMLElement>>((event) => {
        const dndId = event.currentTarget.dataset.dndId;

        if (!dndId) {
            return;
        }

        const drag = draggables.current[dndId];

        if (!drag) {
            return;
        }

        draggingId.current = dndId;

        const immutableRect = drag.ref.current.getBoundingClientRect();

        let dragRect = {
            x: immutableRect.x,
            y: immutableRect.y,
            width: immutableRect.width,
            height: immutableRect.height,
        };

        const dropRects: DOMRect[] = [];
        const dropRectsMeta: (Record<string, unknown> | undefined)[] = [];
        const dropRectsId: string[] = [];

        for (const drop of Object.values(droppables.current)) {
            dropRects.push(drop.ref.current.getBoundingClientRect());
            dropRectsMeta.push(drop.meta);
            dropRectsId.push(drop.id);
        }

        function onMouseMove(event: MouseEvent) {
            let x = event.movementX;
            let y = event.movementY;

            for (const modifier of propsRef.current.dragModifiers) {
                ({x, y} = modifier(
                    transform.current!, {x, y}, drag,
                    overId.current ? draggables.current[overId.current] : undefined)
                );
            }

            if (x === 0 && y === 0) {
                return;
            }

            transform.current = {x: transform.current!.x + x, y: transform.current!.y + y};

            dragRect = {...dragRect, x: dragRect.x + x, y: dragRect.y + y};

            const index = propsRef.current.getCollision(dragRect, drag.meta, dropRects, dropRectsMeta);

            if (overId.current !== (dropRectsId[index] || null)) {
                const old = overId.current;
                overId.current = dropRectsId[index];
                updateDrop(old);
                updateDrop(overId.current);
            }

            updateDrag(draggingId.current);

            propsRef.current.onDragMove?.(dragRect, drag.meta, dropRects[index], dropRectsMeta[index]);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', onMouseMove);

            const lastTransform = transform.current;
            transform.current = null;

            updateDrag(draggingId.current);

            propsRef.current.onDragEnd?.(drag.meta, droppables.current[overId.current || -1]?.meta, lastTransform!);
            draggingId.current = null;
            overId.current = null;
        }, {once: true});

        transform.current = {x: 0, y: 0};

        updateDrag(draggingId.current);

        propsRef.current.onDragStart?.(dragRect, drag.meta);
    }, [updateDrag, updateDrop]);

    const contextValue = useRef({onMouseDown, draggables, droppables, draggingId, transform, overId});

    return <DnDContext.Provider value={contextValue}>{props.children}</DnDContext.Provider>;
}

export function useDrag(id: string, meta?: Record<string, unknown>) {
    const context = useContext(DnDContext);
    const ref = useRef<HTMLElement>(null);
    const [, update] = useState(false);

    useEffect(() => {
        if (!ref) {
            return;
        }

        context.current.draggables.current[id] = {
            ref: ref as MutableRefObject<HTMLElement>,
            onStateUpdate: () => update((old) => !old),
            id,
        };

        return () => {
            delete context.current.draggables.current[id];
        };
    }, [context, id]);

    useEffect(() => {
        context.current.draggables.current[id].meta = meta;
    }, [context, id, meta]);

    return {
        ref,
        listeners: {onMouseDown: context.current.onMouseDown},
        attributes: {'data-dnd-id': id},
        transform: context.current.draggingId.current === id
            ? context.current.transform.current
            : undefined,
        over: context.current.overId.current
            ? context.current.droppables.current[context.current.overId.current].meta
            : undefined,
    };
}

export function useDrop(id: string, meta?: Record<string, unknown>) {
    const context = useContext(DnDContext);
    const ref = useRef<HTMLElement>(null);
    const [, update] = useState(false);

    useEffect(() => {
        if (!ref) {
            return;
        }

        context.current.droppables.current[id] = {
            ref: ref as MutableRefObject<HTMLElement>,
            onStateUpdate: () => update((old) => !old),
            id,
        };

        return () => {
            delete context.current.droppables.current[id];
        };
    }, [context, id]);

    useEffect(() => {
        context.current.droppables.current[id].meta = meta;
    }, [context, id, meta]);

    return {
        ref,
        attributes: {'data-dnd-id': id, draggable: false},
        over: context.current.draggingId.current && context.current.overId.current === id
            ? context.current.draggables.current[context.current.draggingId.current].meta
            : undefined,
    };
}
