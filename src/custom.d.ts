declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';

declare module '*.svg' {
    import * as React from 'react';

    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export {ReactComponent};

    const url: string;

    export default url;
}

declare global {
    export type ObjectKeys<T> =
        // eslint-disable-next-line @typescript-eslint/ban-types
        T extends object ? (keyof T)[] :
        T extends number ? [] :
        T extends Array<any> | string ? string[] :
        never;

    export type ObjectValues<T> =
        // eslint-disable-next-line @typescript-eslint/ban-types
        T extends object ? (T[keyof T])[] :
        // T extends number ? [] :
        // T extends Array<any> | string ? string[] :
        never;

    export interface ObjectConstructor {
        keys<T>(o: T): ObjectKeys<T>,
        values<T>(o: T): ObjectValues<T>
    }
}
