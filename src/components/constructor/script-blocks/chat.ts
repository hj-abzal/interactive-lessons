import {ActionButtonProps, useChat} from '@/context-providers/chat';
import {resourcesIds} from '@/react-i18next.d';
import {useTranslation} from 'react-i18next';
import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {sleep} from '@/utils/use-stages';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';
import glyphs from '@/components/icon/glyphs';
import {ButtonSizeEnum, ButtonThemeAppearanceEnum} from '@/components/button/themes';

export const chatScriptModule: ScriptModule = {
    id: 'chat',
    name: 'Чат',
    icon: 'ChatProvider',
    color: '#2F80ED',
    hook: useChatScripts,
};

// FIXME: нормальная проверка на i18n а не :
const setText = (t, textOrKey, namespace) => {
    if (textOrKey.includes(':')) {
        return textOrKey;
    } else {
        return t(textOrKey, {ns: namespace});
    }
};

function useChatScripts() {
    const chat = useChat();
    const {t, i18n} = useTranslation(resourcesIds);

    const sendMessageBlock = scriptBlock({
        title: 'Отправить сообщение',
        func: async (inputs, {moduleState}) => {
            await chat.typeMessage({
                ...inputs, // @ts-ignore
                asMarkdown: true,
                text: setText(t, inputs.text, moduleState.currentNamespace),
                delay: moduleState.globalDelay ? moduleState.globalDelay : inputs.delay,
            });
        },
        inputs: {
            text: {
                label: 'Текст сообщения',
                type: InputTypeType.textarea,
                defaultValue: 'replica',
                isRequired: true,
            },
            delay: {
                label: 'Время печати',
                type: InputTypeType.number,
                defaultValue: 1000,
            },
            tag: {
                label: 'Тег (не обязательно)',
                type: InputTypeType.textarea, // TODO: add creatable tags select
            },
            isRight: {
                label: 'Показать справа?',
                type: InputTypeType.toggle,
                defaultValue: false,
            },
        },
    });

    const addChatButtonsBlock = scriptBlock({
        title: 'Добавить кнопку в чат',
        func: (inputs, {runStage}) => {
            const button = {
                ...(inputs.withStyles ? inputs : {}),
                label: inputs.label,
                tag: inputs.tag,
                onClick: () => runStage(inputs.stageToRun),
            } as ActionButtonProps;

            chat.addButton(button);
        },
        inputs: {
            label: {
                label: 'Текст на кнопке',
                type: InputTypeType.textarea,
                defaultValue: 'Далее',
                isRequired: true,
            },
            tag: {
                label: 'Тег (не обязательно)',
                type: InputTypeType.textarea, // TODO: add creatable tags select
            },
            withStyles: {
                label: 'Настроить стили?',
                type: InputTypeType.toggle,
                defaultValue: false,
            },
            size: {
                label: 'Размер',
                type: InputTypeType.select,
                isClearable: true,
                options: Object.keys(ButtonSizeEnum),
                defaultValue: ButtonSizeEnum.medium,
                showOn: {withStyles: [true]},
            },
            theme: {
                label: 'Тема кнопки',
                type: InputTypeType.select,
                isClearable: true,
                options: Object.keys(ButtonThemeAppearanceEnum),
                defaultValue: ButtonThemeAppearanceEnum.primary,
                showOn: {withStyles: [true]},
            },
            leftIcon: {
                label: 'Иконка левая',
                type: InputTypeType.select,
                isClearable: true,
                options: Object.keys(glyphs),
                showOn: {withStyles: [true]},
            },
            rightIcon: {
                label: 'Иконка правая',
                type: InputTypeType.select,
                isClearable: true,
                options: Object.keys(glyphs),
                showOn: {withStyles: [true]},
            },
            isFullWidth: {
                label: 'Растянуть на всю ширину ?',
                type: InputTypeType.toggle,
                showOn: {withStyles: [true]},
            },
            disabled: {
                label: 'Неактивна?',
                type: InputTypeType.toggle,
                showOn: {withStyles: [true]},
            },
            hidden: {
                label: 'Скрыта?',
                type: InputTypeType.toggle,
                showOn: {withStyles: [true]},
            },
            link: {
                label: 'Ссылка',
                type: InputTypeType.textarea,
                showOn: {withStyles: [true]},
            },
            stageToRun: {
                isOverlined: true,
                label: 'По клику запустить сценарий',
                type: InputTypeType.stage,
                isRequired: true,
            },
        },
    });

    const removeChatButtonsBlock = scriptBlock({
        title: 'Убрать все кнопки из чата',
        func: (inputs) => {
            chat.clearButtons(inputs.tag);
        },
        inputs: {
            tag: {
                label: 'Тег (не обязательно)',
                type: InputTypeType.textarea, // TODO: add creatable tags select
            },
        },
    });

    const clearMessagesBlock = scriptBlock({
        title: 'Очистить сообщения',
        func: async (inputs) => {
            chat.clearMessages(inputs.tag);
            await sleep(inputs.isMoment ? 0 : 300);
        },
        inputs: {
            tag: {
                label: 'Тег (не обязательно)',
                type: InputTypeType.textarea, // TODO: add creatable tags select
            },
            isMoment: {
                label: 'Без задержки?',
                type: InputTypeType.toggle,
                defaultValue: false,
            },
        },
    });

    const setDelayForAllNewMessages = scriptBlock({
        title: 'Установить задержку всем новым сообщениям',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                if (inputs.delay === 0 || inputs.delay > 0) {
                    draft.globalDelay = inputs.delay;
                } else {
                    delete draft.globalDelay;
                }
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            delay: {
                label: 'Время печати',
                type: InputTypeType.number,
                defaultValue: 100,
            },
        },
    });

    const blurMessagesBlock = scriptBlock({
        title: 'Заблюрить сообщения',
        func: (inputs) => {
            chat.blurMessages(inputs.tag);
        },
        inputs: {
            tag: {
                label: 'Тег (не обязательно)',
                type: InputTypeType.textarea, // TODO: add creatable tags select
            },
        },
    });

    const setTextsNamespace = scriptBlock({
        title: 'Выбрать тему для текстов',
        func: async (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.currentNamespace = inputs.namespace;
            });
            await i18n.setDefaultNamespace(inputs.namespace);
        },
        isRunOnChangeInput: true,
        inputs: {
            namespace: {
                label: 'Название темы',
                type: InputTypeType.select,
                isRequired: true,
                options: resourcesIds,
            },
        },
    });

    return {
        blocks: {
            sendMessageBlock,
            clearMessagesBlock,
            blurMessagesBlock,
            addChatButtonsBlock,
            removeChatButtonsBlock,
            setTextsNamespace,
            setDelayForAllNewMessages,
        },
    };
}
