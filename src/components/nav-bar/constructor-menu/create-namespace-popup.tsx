import React from 'react';
import Card from '@/components/card';
import Button from '@/components/button';
import {css, useTheme} from '@emotion/react';
import TextArea from '@/components/constructor/side-bar/script-block/widget/text-area';
import {useForm} from 'react-hook-form';
import {usePopup} from '@/context-providers/popup';

export type NamespaceForm = {
    name: string,
}

export type Props = {
    popupId: string,
    data?: NamespaceForm,
    onSubmit: (params: NamespaceForm) => void,
}

export const CreateNamespacePopup = ({
    popupId,
    onSubmit,
    data,
}: Props) => {
    const popupper = usePopup();
    const form = useForm<NamespaceForm>({defaultValues: data});
    const theme = useTheme();

    const _onSumbit = (data: NamespaceForm) => {
        popupper.hidePopup(popupId);
        onSubmit(data);
    };

    return (
        <Card>
            <form
                onSubmit={form.handleSubmit(_onSumbit)}
                css={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    padding: 16px;
                    max-width: 680px;
                    
                    .form-input {
                      margin-bottom: 16px;
                      border: 2px solid ${theme.colors.grayscale.placeholder};
                      border-radius: 6px;
                    }
            `}>
                <div className="form-input">
                    <TextArea
                        {...form.register('name', {required: true})}
                        control={form.control}
                        params={{
                            label: 'Имя',
                            name: 'name',
                        }}
                    />
                </div>
                <Button type='submit'>
                    {data ? 'Изменить' : 'Создать'}
                </Button>
            </form>
        </Card>
    );
};
