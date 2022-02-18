import React from 'react';
import SvelteJSONEditor from './svelte-json-editor';

export interface DataEditorProps {
    value: any;
    onChange: (newData: any) => void;
    isNavigationBarHidden?: boolean;
    isMenuBarHidden?: boolean;
    isInitiallyCollapsed?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    disabled?: boolean,
}

export const DataEditor =
    (p: DataEditorProps) => {
        return (
            <SvelteJSONEditor
                json={p.value}
                text={undefined}
                readOnly={false}
                navigationBar={!p.isNavigationBarHidden}
                mainMenuBar={!p.isMenuBarHidden}
                onChange={(newDataJSON) => {
                    if (!p.disabled) {
                        p.onChange(newDataJSON.json);
                    }
                }}
                onFocus={p.onFocus}
                onBlur={p.onBlur}
                isInitiallyCollapsed={p.isInitiallyCollapsed}
            />
        );
    };
