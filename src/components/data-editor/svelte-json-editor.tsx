import React, {useEffect, useRef} from 'react';
import {logger} from '@/utils/logger';
import {css} from '@emotion/react';
import {JSONEditor} from 'svelte-jsoneditor/dist/jsoneditor.js';

export default function SvelteJSONEditor(props) {
    const editor = useRef(null);

    // create editor
    const onRef = (ref) => {
        if (ref && !editor.current) {
            logger.debug('create editor');
            editor.current = new JSONEditor({
                target: ref,
                props,
            });
        }
    };

    // update props
    useEffect(() => {
        if (editor.current) {// @ts-ignore
            editor.current.updateProps(props);
            logger.debug('update props', props);
        }
    }, [props]);

    // destroy editor
    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        if (editor.current && props.isInitiallyCollapsed) {// @ts-ignore
            editor.current.expand(() => false);
        }

        return () => {
            if (editor.current) {
                logger.debug('destroy editor');// @ts-ignore
                editor.current.destroy();
                editor.current = null;
            }
        };
    }, []);

    return <div css={css`
        .jsoneditor-main {
            border: none !important;
        }
        .jsoneditor-main.focus {
            box-shadow: none !important;
        }
        .jsoneditor-contextmenu {
            border-radius: 2px 16px 16px 16px;
            overflow: hidden;
        }
        .powered-by {
            display: none;
        }
    `} className="svelte-jsoneditor-react" ref={onRef}></div>;
}
