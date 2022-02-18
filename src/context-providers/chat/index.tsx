import React, {createContext, useContext, useMemo, useState} from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {MessageProps} from '@/components/chat/message';
import {useSleep} from '@/utils/sleep';
import {ButtonProps} from '../../components/button';
import {ProviderProps} from '@/utils/create-safe-context';

export type ActionButtonProps = {
    label: string;
    tag?: string;
} & ButtonProps

type Tag = string | number;

export type ChatStateType = {
    messages: MessageProps[];
    sendMessage: (message: MessageProps) => void;
    clearMessages: (tag?: Tag) => void;
    blurMessages: (tag?: Tag) => void;
    showTypingMessages: (tag?: Tag) => void;
    typeMessage: (message: MessageProps) => void;
    hasTag: (tag?: Tag) => boolean;
    buttons?: ActionButtonProps[];
    setButtons: (buttons: ActionButtonProps[]) => void;
    addButton: (button: ActionButtonProps) => void;
    clearButtons: (tag?: Tag) => void;
    disableButtons: (tag?: Tag) => void;
    enableButtons: (tag?: Tag) => void;
    sleep: (delay: number) => void,
}

const defaultValue: ChatStateType = {
    messages: [],
    sendMessage: () => {},
    clearMessages: () => {},
    blurMessages: () => {},
    showTypingMessages: () => {},
    typeMessage: () => {},
    hasTag: (tag) => false,
    buttons: [],
    setButtons: () => {},
    addButton: () => {},
    clearButtons: () => {},
    disableButtons: () => {},
    enableButtons: () => {},
    sleep: () => {},
};

export const ChatContext = createContext<ChatStateType>(defaultValue);

export const useChat = () => {
    return useContext(ChatContext);
};

export default function ChatProvider({children}: ProviderProps) {
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [buttons, setButtons] = useState<ActionButtonProps[]>([]);
    const sleep = useSleep();

    const sendMessage = (message: MessageProps) => {
        setMessages((oldMessages) => oldMessages.concat([message]));
    };

    const showTypingMessages = (tag?: Tag) => {
        setMessages((oldMessages) =>
            oldMessages.map((m) =>
                (!tag || m.tag === tag) ? {...m, isTyping: false} : m));
    };

    const typeMessage = async (message: MessageProps) => {
        await new Promise((resolve) => {
            const timerId = setTimeout(resolve, message.delay || 0);
            sendMessage({...message, isTyping: true, onTypingClick: () => {
                clearTimeout(timerId);
                resolve(true);
            }});
        });
        showTypingMessages();
    };

    const clearMessages = (tag?: Tag) => {
        if (tag) {
            setMessages((oldMessages) => oldMessages.filter((m) => m.tag !== tag));
        } else {
            setMessages([]);
        }
    };

    const blurMessages = (tag?: Tag) => {
        setMessages((oldMessages) =>
            oldMessages.map((m) =>
                !m.isBlurred && (!tag || m.tag === tag) ? {...m, isBlurred: true} : m));
    };

    const messagesTags = useMemo(() => {
        return messages.reduce((acc, message) => {
            if (message.tag) {
                acc[message.tag] = true;
            }

            return acc;
        }, {});
    }, [messages]);

    const hasTag = (tag) => messagesTags[tag];

    const addButton = (button: ActionButtonProps) => {
        setButtons((oldButtons) => [...(oldButtons || []), button]);
    };

    const clearButtons = (tag?: Tag) => {
        if (tag) {
            setButtons((oldButtons) => oldButtons.filter((b) => b.tag !== tag));
        } else {
            setButtons([]);
        }
    };

    const disableButtons = (tag?: Tag) => {
        setButtons((oldButtons) =>
            oldButtons.map((m) =>
                !m.disabled && (!tag || m.tag === tag) ? {...m, disabled: true} : m));
    };

    const enableButtons = (tag?: Tag) => {
        setButtons((oldButtons) =>
            oldButtons.map((m) =>
                !m.disabled && (!tag || m.tag === tag) ? {...m, disabled: false} : m));
    };

    return (
        <ChatContext.Provider value={{
            messages,
            sendMessage,
            clearMessages,
            blurMessages,
            showTypingMessages,
            typeMessage,
            hasTag,
            buttons,
            setButtons,
            addButton,
            clearButtons,
            disableButtons,
            enableButtons,
            sleep,
        }}>
            {children}
        </ChatContext.Provider>
    );
}
