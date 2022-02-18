import React, {ReactNode, useEffect} from 'react';
import {Global} from '@emotion/react';
import {resetStyles} from '@/utils/styles/reset.css';
import {globalStyles} from '@/utils/styles/global.css';
import Chat from '@/components/chat';
import {useSberclass} from '@/context-providers/sberclass';
import {SmartViewportWrapper} from '@/components/smart-viewport-wrapper';

export type Props = {
    children: ReactNode,
}

export type LessonLayoutProps = {
    children?: ReactNode
}

export const LessonLayout = ({children}: LessonLayoutProps) => (
    <>
        <SmartViewportWrapper>
            {children}
            <Chat />
        </SmartViewportWrapper>
        <Global styles={resetStyles} />
        <Global styles={globalStyles} />
    </>
);

export const createLesson = (Component: React.ComponentType, name: string) =>
    function Lesson() {
        const sberclass = useSberclass();

        useEffect(() => {
            sberclass.setLessonName(name);
        }, []);

        return (
            <LessonLayout>
                <Component />
            </LessonLayout>
        );
    };
