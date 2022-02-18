import {createContextProvider} from '@/utils/create-safe-context';
import React, {useEffect, useRef, useState} from 'react';
import {PAGE_HEIGHT, PAGE_WIDTH} from '@/const';

export type SmartViewportWrapperContextType = {
    contentWidth: number;
    contentHeight: number;
    windowWidth: number;
    windowHeight: number;
    aspectRatio: number;
    zoom: number;
    isSmartZoomEnabled: boolean;
    wrapperWidth: number,
    wrapperHeight: number,
    setIsSmartZoomEnabled: (isEnabled: boolean) => void;
    bgColor?: string;
    setBgColor: (newBgColor?: string) => void;
    setAspectRatio: (newAspectRatio: number) => void;
    disabledAspectRationWrapper?: boolean,
    frameRef: React.RefObject<HTMLDivElement> | null,
    inited: boolean,
    setInited: (val: boolean) => void,
    handlerResize: () => void,
}

const defaultValue: SmartViewportWrapperContextType = {
    contentWidth: 1280,
    contentHeight: 720,
    wrapperWidth: 1280,
    wrapperHeight: 720,
    windowWidth: 1280,
    windowHeight: 720,
    aspectRatio: 1280 / 720,
    zoom: 1,
    isSmartZoomEnabled: true,
    setIsSmartZoomEnabled: () => null,
    bgColor: undefined,
    setBgColor: () => null,
    setAspectRatio: () => null,
    disabledAspectRationWrapper: false,
    frameRef: null,
    inited: false,
    setInited: () => null,
    handlerResize: () => null,
};

export const [
    SmartViewportWrapperContext,
    SmartViewportWrapperProvider,
    useSmartViewportWrapper
] = createContextProvider<SmartViewportWrapperContextType>(
    'SmartViewportWrapper',
    () => {
        const [wrapperWidth, setWrapperWidth] = useState<number>(defaultValue.contentWidth);
        const [wrapperHeight, setWrapperHeight] = useState<number>(defaultValue.contentHeight);
        const [windowWidth, setWindowWidth] = useState<number>(defaultValue.windowWidth);
        const [windowHeight, setWindowHeight] = useState<number>(defaultValue.windowHeight);
        const [aspectRatio, setAspectRatio] = useState<number>(defaultValue.aspectRatio);
        const [bgColor, setBgColor] = useState<string|undefined>(defaultValue.bgColor);
        const [resize, setResize] = useState<boolean>(false);
        const [zoom, setZoom] = useState(defaultValue.zoom);
        const [isSmartZoomEnabled, setIsSmartZoomEnabled] = useState(defaultValue.isSmartZoomEnabled);
        const [disabledAspectRationWrapper, setDisabledAspectRationWrapper] = useState(false);
        const [inited, setInited] = useState(false);

        const frameRef = useRef<HTMLDivElement>(null);

        const handlerResize = () => setResize((prev) => !prev);

        useEffect(() => {
            window.addEventListener('resize', handlerResize);
            return () => window.removeEventListener('resize', handlerResize);
        }, []);

        useEffect(() => {
            if (!inited || !frameRef.current?.clientWidth || !frameRef.current?.clientHeight) {
                return;
            }

            const windowWidth = frameRef.current?.clientWidth || 0;
            const windowHeight = frameRef.current?.clientHeight || 0;
            const currentAspectRatio = Number((windowWidth / windowHeight).toFixed(2));

            setWindowWidth(windowWidth);
            setWindowHeight(windowHeight);

            if (currentAspectRatio > aspectRatio) {
                if (isSmartZoomEnabled) {
                    setZoom(windowHeight / PAGE_HEIGHT);
                } else {
                    setZoom(1);
                }

                const percentDeviations = (currentAspectRatio - aspectRatio) / currentAspectRatio;
                const correctedWidth = windowWidth - windowWidth * percentDeviations;

                setWrapperHeight(windowHeight);
                setWrapperWidth(correctedWidth);
            } else if (currentAspectRatio < aspectRatio) {
                if (isSmartZoomEnabled) {
                    setZoom(windowWidth / PAGE_WIDTH);
                } else {
                    setZoom(1);
                }

                const percentDeviations = (aspectRatio - currentAspectRatio) / aspectRatio;
                const correctedHeight = windowHeight - windowHeight * percentDeviations;

                setWrapperHeight(correctedHeight);
                setWrapperWidth(windowWidth);
            }
        }, [resize, isSmartZoomEnabled, aspectRatio, frameRef.current, frameRef.current, inited]);

        return {
            contentWidth: wrapperWidth / zoom,
            contentHeight: wrapperHeight / zoom,
            wrapperWidth,
            wrapperHeight,
            windowWidth: windowWidth,
            windowHeight: windowHeight,
            aspectRatio: aspectRatio,
            setAspectRatio: setAspectRatio,
            zoom: zoom,
            isSmartZoomEnabled: isSmartZoomEnabled,
            setIsSmartZoomEnabled: setIsSmartZoomEnabled,
            bgColor: bgColor,
            setBgColor: setBgColor,
            disabledAspectRationWrapper,
            setDisabledAspectRationWrapper,
            frameRef,
            inited,
            setInited,
            handlerResize,
        };
    }
);
