import React from 'react';
import Card from '@/components/card';
import Button from '@/components/button';
import {css, useTheme} from '@emotion/react';
import TextArea from '@/components/constructor/side-bar/script-block/widget/text-area';
import {useForm} from 'react-hook-form';
import {usePopup} from '@/context-providers/popup';
import {Namespace, SberPackage, Scenario} from '@/context-providers/constructor-storage/types';
import {JsonFormInput, SelectFormInput} from '@/components/nav-bar/constructor-menu/form-inputs';
import {simulatorTemplate} from '@/components/nav-bar/constructor-menu/meta-templates/simulator';
import {GUID} from '@/utils/generate-id';
import {trainerTemplate} from '@/components/nav-bar/constructor-menu/meta-templates/trainer';
import Space from '@/components/space';

export type SberPackageForm = {
    name: string,
    scenarioId?: string,
    namespaceId?: string,
    lessonPath?: string,
    meta: unknown,
}

export type SberPackageFormResult = Omit<SberPackage, 'id'>;

export type Props = {
    popupId: string,
    data?: SberPackageFormResult,
    onSubmit: (params: SberPackageFormResult) => void,
    namespaces: Namespace<any, any>[],
    getScenariosByNamespaceId: (id: string) => Scenario<any, any>[],
}

export const SberPackagePopup = ({
    popupId,
    onSubmit,
    namespaces,
    getScenariosByNamespaceId,
    data,
}: Props) => {
    const popupper = usePopup();
    const theme = useTheme();

    const form = useForm<SberPackageForm>({
        defaultValues: {
            ...(data || {}),
            meta: data?.meta ? JSON.parse(data.meta) : undefined,
        },
    });

    const metaValue = form.watch('meta');
    const namespaceIdValue = form.watch('namespaceId');
    const lessonPathValue = form.watch('lessonPath');

    const namespaceOptions = namespaces.map((ns) => ({
        label: ns.name,
        value: ns.id,
    }));

    const scenarioOptions = namespaceIdValue
        ? getScenariosByNamespaceId(namespaceIdValue).map((scen) => ({
            label: scen.name,
            value: scen.id,
        }))
        : [];

    const _onSumbit = (data: SberPackageForm) => {
        popupper.hidePopup(popupId);
        onSubmit({...data, meta: JSON.stringify(data.meta)});
    };

    return (
        <Card>
            <form
                onSubmit={form.handleSubmit(_onSumbit)}
                css={css`
                    width: 600px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    padding: 16px;
                    max-width: 680px;
                    
                    .form-input {
                      margin-bottom: 16px;
                      border-radius: 6px;
                      width: 100%
                    }
                    
                    .divider {
                      height: 4px;
                      background-color: ${theme.colors.grayscale.placeholder};
                    }
                    
                    .form-input-label {
                      display: flex;
                      width: 100%;
                    }
                    
                    .meta-input {
                      width: 100%;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      margin-top: 16px;
                      
                      .meta-title {
                          font-weight: bold;
                          text-align: center;
                          display: block;
                      }
                      
                      .meta-actions {
                        margin-top: 8px;
                        display: flex;
                        margin-bottom: 16px;
                      }
                      
                      .json-editor {
                        width: 100%;
                        height: 600px;
                        margin-top: 16px;
                        margin-bottom: 16px;
                      }
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

                {!namespaceIdValue &&
                    <div className="form-input">
                        <TextArea
                            {...form.register('lessonPath', {required: true})}
                            control={form.control}
                            params={{
                                label: 'Импорт из кода (имя папки, только для не конструкторных)',
                                name: 'lessonPath',
                            }}
                        />
                    </div>
                }

                <div className="divider"></div>

                {!lessonPathValue &&
                    <>
                        <div className="form-input">
                            <SelectFormInput
                                {...form.register('namespaceId', {required: true})}
                                control={form.control}
                                placeholder="Тема"
                                options={namespaceOptions}
                            />
                        </div>

                        <div className="divider"></div>

                        <div className="form-input">
                            <SelectFormInput
                                className="form-input-label"
                                {...form.register('scenarioId', {required: true})}
                                control={form.control}
                                placeholder="Сценарий"
                                options={scenarioOptions}
                            />
                        </div>
                    </>
                }

                <div className="divider"></div>

                <div className="meta-input">
                    <div className="meta-title" >
                        Мета конфиг
                    </div>

                    {!metaValue &&
                        <div className="meta-actions">
                            <Button
                                size="small"
                                type='submit'
                                onClick={() => {
                                    form.setValue('meta', simulatorTemplate({
                                        name: namespaces.find((ns) => ns.id === namespaceIdValue)?.name,
                                        guid: GUID(),
                                    }));
                                }}
                            >
                                Шаблон симулятора
                            </Button>

                            <Space isInline={true} size={16} />

                            <Button
                                size="small"
                                type='submit'
                                onClick={() => {
                                    form.setValue('meta', trainerTemplate({
                                        name: namespaces.find((ns) => ns.id === namespaceIdValue)?.name,
                                        guid: GUID(),
                                    }));
                                }}
                            >
                                Шаблон тренажера
                            </Button>
                        </div>
                    }

                    {metaValue &&
                        <div className="json-editor">
                            <JsonFormInput
                                {...form.register('meta', {required: true})}
                                control={form.control}
                            />
                        </div>
                    }
                </div>

                <Button type='submit'>
                    {data ? 'Изменить' : 'Создать'}
                </Button>
            </form>
        </Card>
    );
};
