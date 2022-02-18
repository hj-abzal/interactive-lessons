import {useEffect, useRef, useState} from 'react';

export const useInputHandler = () => {
    const [inputValue, setInputValue] = useState<string | undefined>();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (
                event.code !== 'Backslash'
                && inputRef.current
                && !event.shiftKey
                && !event.ctrlKey
                && !event.altKey
                && !event.metaKey
                && event.key
                && event.key.length === 1
                // @ts-ignore
                && event.target.nodeName !== 'INPUT'
                // @ts-ignore
                && event.target.nodeName !== 'TEXTAREA'
            ) {
                event.preventDefault();
                inputRef.current.focus();
                setInputValue(event.key);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return {
        inputRef,
        inputValue,
        setInputValue,
    };
};
