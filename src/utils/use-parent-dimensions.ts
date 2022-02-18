import {useEffect, useState} from 'react';

export const useParentDimensions = (ref) => {
    const [height, setHeight] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);

    const updateDimensions = () => {
        setWidth(ref?.current?.parentElement?.offsetWidth);
        setHeight(ref?.current?.parentElement?.offsetHeight);
    };

    useEffect(() => {
        ref?.current?.parentElement?.addEventListener('resize', updateDimensions);
        updateDimensions();
        return () => {
            ref?.current?.parentElement?.removeEventListener('resize', updateDimensions);
        };
    }, []);

    return {parentHeight: height, parentWidth: width};
};
