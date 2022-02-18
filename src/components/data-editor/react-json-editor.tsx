import React from 'react';
import {JsonEditor as Editor} from 'jsoneditor-react';
import Ajv from 'ajv';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import {style} from './css';
import {Global} from '@emotion/react';
const ajv = new Ajv({allErrors: true, verbose: true});

export interface DataEditorProps {
    data: any;
    setData: (newData: any) => void;
}

export const ReactJSONEditor = ({data, setData}: DataEditorProps) => {
    return (
        <>
            <Editor
                value={data}
                onChange={setData}
                ajv={ajv}
                ace={ace}
                theme="ace/theme/github"
                // schema={yourSchema}
            />
            <Global styles={style} />
        </>
    );
};
