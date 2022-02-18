import _ from 'lodash';

export function queue<T>() {
    let q: T[] = [];
    let tail = 0;
    let pops = 0;

    return {
        _getItems: () => [...q],
        len: () => {
            return q.length - pops;
        },
        push: (item: T) => {
            q.push(_.clone(item));
        },
        pushMany: (items: T[]) => {
            q.push(...items.map(_.clone));
        },
        pop: (): T => {
            if (tail === q.length) {
                throw new Error(`out of range on ${pops + 1} pop`);
            }

            const item = q[tail];

            tail++;
            pops++;

            return item;
        },
        flush: () => {
            q = [];
            tail = 0;
            pops = 0;
        },
    };
}

export function stack<T>() {
    let s: T[] = [];
    let pops = 0;

    return {
        _getItems: () => [...s],
        len: () => {
            return s.length;
        },
        push(item: T) {
            s.push(_.clone(item));
        },
        pushMany(items: T[]) {
            s.push(...items.map(_.clone));
        },
        pop() {
            if (s.length === 0) {
                throw new Error(`out of range on ${pops + 1} pop`);
            }

            const item = s.pop();

            pops++;

            return item!;
        },
        flush: () => {
            s = [];
        },
    };
}
