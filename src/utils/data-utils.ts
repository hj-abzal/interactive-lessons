
export type NormalizedObj<T> = {
    [id: string]: T,
}

export type Primitive = string | null | number | boolean | undefined;

export type RemoveCondition = Primitive | {[key: string]: Primitive};

export function isArray(val: any): val is Array<any> {
    return Array.isArray(val);
}

export function removeFromArray<T>(obj: T[], condition: RemoveCondition): T[] {
    if (typeof obj[0] !== 'object') {
        if (typeof condition === 'object' && condition !== null) {
            throw new Error('Invalid condition type object');
        }

        // @ts-ignore
        return obj.filter((o) => o !== condition);
    }

    if (typeof condition !== 'object' || condition === null) {
        throw new Error('Invalid condition type primitive');
    }

    return obj.filter((o) => {
        // @ts-ignore
        return Object.keys(condition).reduce((isFit, key) => {
            return o[key] !== condition[key];
        }, false);
    });
}

export function removeFromObject<T>(obj: T, condition: RemoveCondition): T {
    if (typeof condition !== 'object' || condition === null) {
        throw new Error('Invalid condition type primitive');
    }

    // @ts-ignore
    return Object.keys(obj).reduce((acc, id) => {
        // @ts-ignore
        const fit = Object.keys(condition).reduce((isFit, key) => {
            return obj[id][key] !== condition[key];
        }, false);

        if (fit) {
            acc[id] = obj[id];
        }

        return acc;
    }, {});
}

export function selectByValues<T>(fromObj: NormalizedObj<T>, valuesObj: {[key in keyof T]?: T[key]}): T[] {
    return Object.values(fromObj).filter((item) => {
        return Object.keys(valuesObj).every((key) => item[key] === valuesObj[key]);
    });
}

export function selectByKeys<T>(fromObj: NormalizedObj<T>, keys: string[]) {
    return keys.map((key) => fromObj[key]).filter(Boolean);
}
