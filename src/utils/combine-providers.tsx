import React from 'react';
import {ReactNode} from 'react';

export type CombinedProviderProps<TGlobalProps> = {
    children: ReactNode,
    globalProps?: TGlobalProps,
}

export function combineProviders<TGlobalProps>(
    providers: React.ComponentType<Partial<TGlobalProps> | any & {children: ReactNode}>[]
) {
    return function CombinedProviderHOC({
        children,
        globalProps,
    }: CombinedProviderProps<TGlobalProps>) {
        return (
            <>
                {providers.reduceRight((acc, Comp) => {
                    return globalProps ? <Comp {...globalProps}>{acc}</Comp> : <Comp>{acc}</Comp>;
                }, children as ReactNode)}
            </>
        );
    };
}
