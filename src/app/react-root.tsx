import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../polyfills';
import {initDebugUtils} from '@/utils/debug-utils';
import {App} from './app';
import {initI18n} from '@/utils/i18n';

initDebugUtils();
initI18n();

ReactDOM.render(
    <App />,
    document.getElementById('react-root')
);
