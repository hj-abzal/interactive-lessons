import {useRef, useImperativeHandle, RefObject} from 'react';

export function useEnhancedRef<
    RefType, EnhancerType extends Record<string | symbol, unknown>
>(ref: RefObject<RefType>, enhancer: EnhancerType) {
    const enhancedRef = useRef<RefType & EnhancerType>(null);

    useImperativeHandle(enhancedRef, () => new Proxy(enhancer, {
        get: function get(target, prop) {
            if (prop in target) {
                return target[prop];
            }

            if (typeof ref.current?.[prop] === 'function') {
                return ref.current?.[prop].bind(ref.current);
            }

            return ref.current?.[prop];
        },
    }) as RefType & EnhancerType);

    return enhancedRef;
}
