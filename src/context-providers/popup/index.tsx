import {createSafeContext} from '@/utils/create-safe-context';
import React, {ReactNode} from 'react';
import {Popup} from '@/components/popup';
import {logger} from '@/utils/logger';
import {useImmerState} from '@/utils/use-immer-state';

export type PopupId = string | number;

export type PopupContent = {
    id: PopupId,
    content: ReactNode,
    isShown: boolean,
    canClose?: boolean,
    priority?: number,
};

export type PopupsMap = {
    [id: string]: PopupContent
}

export type AddPopupParams = {
    id: PopupId,
    content: ReactNode,
    shouldShow?: boolean,
    canClose?: boolean,
    priority?: number,
};

export type PopupContextType = {
    isShown: boolean,
    addPopup: (params: AddPopupParams) => void,
    showPopup: (id: PopupId) => void,
    hidePopup: (id?: PopupId) => void,
    hasPopup: (id: PopupId) => boolean,
}

export const [
    PopupContext,
    usePopup
] = createSafeContext<PopupContextType>('PopupContext');

export const PopupProvider = ({children}: {children?: ReactNode}) => {
    const [popupsMap, producePopupsMap] = useImmerState<PopupsMap>({});

    const addPopup = ({id, canClose, priority, content, shouldShow = true}: AddPopupParams) => {
        producePopupsMap((draft) => {
            draft[String(id)] = {
                id: String(id),
                content,
                canClose,
                priority,
                isShown: shouldShow,
            };
        });
    };

    const showPopup = (id: PopupId) => {
        producePopupsMap((draft) => {
            draft[String(id)].isShown = true;
        });
    };

    const hidePopup = (id?: PopupId) => {
        if (id) {
            producePopupsMap((draft) => {
                draft[String(id)].isShown = false;
            });
            return;
        }

        producePopupsMap((draft) => {
            Object.keys(draft).forEach((popupId) => {
                draft[popupId].isShown = false;
            });
        });
    };

    const hasPopup = (id: PopupId) => Boolean(popupsMap[String(id)]);

    const currentPopup = Object.values(popupsMap)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .find((popup) => popup.isShown);

    const isShown = Boolean(currentPopup);

    const state = {
        isShown: isShown,
        hasPopup,
        showPopup,
        hidePopup,
        addPopup,
        popupsMap,
    };

    logger.debug('POPUP_STATE', state);

    return (
        <PopupContext.Provider
            value={state}
        >
            {children}
            <Popup
                isShown={isShown}
                canClose={currentPopup?.canClose}
                onShownToggle={(val) => {
                    if (currentPopup) {
                        producePopupsMap((draft) => {
                            draft[currentPopup.id].isShown = val;
                        });
                    }
                }}
            >
                {currentPopup?.content}
            </Popup>
        </PopupContext.Provider>
    );
};
