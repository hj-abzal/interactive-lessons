import React from 'react';

export function connectContext<TProps>(mapContextToProps, Component: React.ComponentType<TProps>) {
    return function ContextConnector(props: Partial<TProps>) {
        const ctx = mapContextToProps();

        return <Component {...{...props, ...ctx}} />;
    };
}
