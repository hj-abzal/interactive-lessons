import React, {ReactNode, useContext} from 'react';

type SafeContextResult<TContext> = [
    React.Context<TContext | undefined>,
    () => TContext
];

export type ProviderProps = {
    children: ReactNode;
};

export function createSafeContext<TContext>(name: string): SafeContextResult<TContext> {
    const Context = React.createContext<TContext | undefined>(undefined);

    function useSafeContext() {
        const context = useContext(Context);

        if (!context) {
            throw new Error(
                `Try to call hook of ${name} context, component should be a child of this context provider`
            );
        }

        return context;
    }

    return [
        Context,
        useSafeContext
    ];
}

type ContextProviderRessult<TContext, TProps> = [
    React.Context<TContext | undefined>,
    React.ComponentType<{children: ReactNode} & TProps>,
    () => TContext
];

type ProviderImpl<TContext, TProps> = (props: TProps) => TContext;

export function createContextProvider<TContext, TProps = any>(
    name: string,
    useProviderImpl: ProviderImpl<TContext, TProps>
): ContextProviderRessult<TContext, TProps> {
    const Context = React.createContext<TContext | undefined>(undefined);

    function useSafeContext() {
        const context = useContext(Context);

        if (!context) {
            throw new Error(
                `Try to call hook of ${name} context, component should be a child of this context provider`
            );
        }

        return context;
    }

    function Provider({children, ...props}: {children?: ReactNode} & TProps) {
        const value = useProviderImpl(props as TProps);

        return (
            <Context.Provider value={value}>
                {children}
            </Context.Provider>
        );
    }

    Provider.displayName = name;

    return [
        Context,
        Provider,
        useSafeContext
    ];
}
