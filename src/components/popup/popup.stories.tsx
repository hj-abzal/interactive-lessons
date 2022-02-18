import React, {useEffect, useState} from 'react';
import {Popup, PopupProps} from './';
import {Story} from '@storybook/react';
import Card from '@/components/card';
import Button from '@/components/button';
import {usePopup} from '@/context-providers/popup';

export default {
    component: Popup,
    title: 'Popup',
    parameters: {
        docs: {
            description: {
                component: 'Abstract Clickable component',
            },
            source: {
                type: 'code',
            },
        },
    },
};

export const Default: Story<PopupProps> = (args) => {
    const [isShown, setShown] = useState(args.isShown);

    return (
        <div>
            <Popup isShown={isShown} onShownToggle={(val) => setShown(val)} >
                <Card>
                    <h5>Popup content</h5>
                </Card>
            </Popup>
            <Button onClick={() => setShown(true)}>show popup</Button>
        </div>
    );
};

export const WithProvider: Story = () => {
    const popuper = usePopup();

    useEffect(() => {
        popuper.addPopup({
            id: 'popup1',
            content: (
                <Card>
                    <h5>Popup1 content</h5>
                </Card>
            ),
            shouldShow: false,
        });

        popuper.addPopup({
            id: 'popup2',
            content: (
                <Card>
                    <h5>Popup2 content</h5>
                </Card>
            ),
            shouldShow: false,
        });
    }, []);

    return (
        <div>
            <Button
                onClick={() => popuper.isShown ? popuper.hidePopup() : popuper.showPopup('popup1')}
            >
                show popup1
            </Button>
            <Button
                onClick={() => popuper.isShown ? popuper.hidePopup() : popuper.showPopup('popup2')}
            >
                show popup2
            </Button>

            <Button
                onClick={() => {
                    if (popuper.isShown) {
                        popuper.hidePopup();
                    } else {
                        popuper.showPopup('popup1');
                        popuper.showPopup('popup2');
                    }
                }}
            >
                show both
            </Button>
        </div>
    );
};
