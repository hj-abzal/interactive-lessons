import {useEffect} from 'react';

export const useClickOutside = (ref, callback) => {
    const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    };
    useEffect(() => {
        document.addEventListener('mouseup', handleClick);
        document.addEventListener('touchend', handleClick);
        return () => {
            document.removeEventListener('mouseup', handleClick);
            document.removeEventListener('touchend', handleClick);
        };
    });
};
