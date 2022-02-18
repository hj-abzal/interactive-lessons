import {SberclassProvider} from '@/context-providers/sberclass';
import {SmartViewportWrapperProvider} from '@/context-providers/smart-viewport-wrapper';
import {combineProviders} from '@/utils/combine-providers';
import ThemeProvider from '@/context-providers/theme';
import ChatProvider from '@/context-providers/chat';
import {PopupProvider} from '@/context-providers/popup';
import {DevToolsProvider} from '@/context-providers/devtools';
import {ConstructorStorageProvider} from '@/context-providers/constructor-storage';
import {ConstructorScenarioProvider} from '@/context-providers/constructor-scenario';

export const GlobalProvider = combineProviders([
    ThemeProvider,
    ChatProvider,
    DevToolsProvider,
    SberclassProvider,
    SmartViewportWrapperProvider,
    ConstructorStorageProvider,
    ConstructorScenarioProvider,
    PopupProvider
]);
