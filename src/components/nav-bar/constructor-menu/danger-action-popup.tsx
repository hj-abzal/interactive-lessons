import React from 'react';
import Card from '@/components/card';
import Button from '@/components/button';
import {css} from '@emotion/react';
import Space from '@/components/space';
import {usePopup} from '@/context-providers/popup';

export type Props = {
    title: string,
    onAccept: () => void,
    onDecline?: () => void,
    popupId: string,
}

export const DangerActionPopup = ({
    title,
    onAccept,
    onDecline,
    popupId,
}: Props) => {
    const popupper = usePopup();

    const _onAccept = () => {
        popupper.hidePopup(popupId);
        onAccept();
    };

    const _onDecline = () => {
        popupper.hidePopup(popupId);

        if (onDecline) {
            onDecline();
        }
    };

    return (
        <Card>
            <div
                css={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    padding: 16px;
                    max-width: 680px;
                    
                    .popup-actions {
                      display: flex;
                      margin-top: 16px;
                    }
            `}>
                <h5>{title}</h5>

                <div className='popup-actions'>
                    <Button
                        onClick={_onDecline}
                        theme={'accent'}
                    >
                        Отмена
                    </Button>

                    <Space isInline={true} size={16} />

                    <Button
                        onClick={_onAccept}
                        theme='primary'
                    >
                        OK
                    </Button>
                </div>
            </div>
        </Card>
    );
};
