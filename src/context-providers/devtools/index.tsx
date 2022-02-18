import {useState} from 'react';
import {createContextProvider} from '@/utils/create-safe-context';

export type DevtoolContentItem = {
    text?: string,
    onClick?: () => void,
}

export type DevtoolsCustomContent = {
    sectionName: string,
    content: DevtoolContentItem[],
}

export type DevtoolsState = {
    customContent?: DevtoolsCustomContent,
    setCustomContent: (content: DevtoolsCustomContent) => void,
}

export const [
    DevtoolsContext,
    DevToolsProvider,
    useDevtools
] = createContextProvider<DevtoolsState, any>(
    'Devtools',
    () => {
        const [customContent, setCustomContent] = useState<DevtoolsCustomContent>();

        return {
            setCustomContent,
            customContent,
        };
    }
);
