// DEPRECATED: Нужен для поддержки безконструкторных интерактивов
import {combineProviders} from '@/utils/combine-providers';
import ThemeProvider from '@/context-providers/theme';
import ChatProvider from '@/context-providers/chat';
import {DevToolsProvider} from '@/context-providers/devtools';
import {SberclassProvider} from '@/context-providers/sberclass';
import {SmartViewportWrapperProvider} from '@/context-providers/smart-viewport-wrapper';
import {PopupProvider} from '@/context-providers/popup';

export const GlobalProviderWithoutConstructor = combineProviders([
    ThemeProvider,
    ChatProvider,
    DevToolsProvider,
    SberclassProvider,
    SmartViewportWrapperProvider,
    PopupProvider
]);
