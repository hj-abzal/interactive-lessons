import React, {useMemo} from 'react';
import Creatable from 'react-select/creatable';
import {SelectStyles} from '@/components/select-input/css';
import dayjs from 'dayjs';
import {useConstructorStorage} from '@/context-providers/constructor-storage';
import {ConstructorStorageContextType} from '@/context-providers/constructor-storage';
import {OptionWithMenu} from '@/components/select-input/option-with-menu';
import {ScenarioSchemaRevision} from '@/context-providers/constructor-storage/types';
import {css, useTheme} from '@emotion/react';

function createRevisionOption(storage: ConstructorStorageContextType, rev?: ScenarioSchemaRevision<any>) {
    if (!rev) {
        return undefined;
    }

    const pubMark = storage.isRevisionPublished(rev.id) ? '[P] ' : '';

    const label = `${pubMark} ${rev.name} -- ${dayjs(rev.created).format('MM.DD hh:mm')}`;

    return ({
        label: label,
        value: rev.id,
    });
}

export const RevisionSelector = () => {
    const theme = useTheme();
    const scenarioStorage = useConstructorStorage();

    // const [queryParams, setSearchParams] = useLocationSearchParams<{[s:string]: string}>();

    const options = useMemo(() => scenarioStorage.revisions
        ?.map((rev) => createRevisionOption(scenarioStorage, rev)),
    [scenarioStorage.revisions]);

    const currentValue = createRevisionOption(scenarioStorage, scenarioStorage.currentRevision);

    // useEffect(() => {
    //     const locationCurrentRevision = queryParams.get('revision');
    //     const revisionIds = scenarioStorage.revisions?.map((rev) => rev.id);
    //     if (locationCurrentRevision) {
    //         if (revisionIds?.includes(locationCurrentRevision)) {
    //             scenarioStorage.setCurrentRevision(locationCurrentRevision);
    //         }
    //     }
    //     if (!locationCurrentRevision && currentValue) {
    //         setSearchParams({revision: currentValue.value});
    //     }
    // }, [queryParams]);

    if (!scenarioStorage.revisions || !scenarioStorage.createRevision) {
        return null;
    }

    const Option = (p: any) => (
        <OptionWithMenu
            {...p}
            menuItems={[
                {
                    name: 'Дублировать',
                    onClick: (id) => scenarioStorage.createRevision({copyFromId: id}),
                },
                {
                    name: 'Опубликовать',
                    onClick: (id) => scenarioStorage.publishRevision(id),
                },
                {
                    name: 'Удалить',
                    onClick: (id) => scenarioStorage.deleteRevision(id),
                }
            ]}
        />
    );

    return (
        <Creatable
            css={css`
                ${SelectStyles}
                .input-select {
                    &__control {
                        background-color: ${theme.colors.grayscale.white};
                        box-shadow: none;
                    }
                }
            `}
            components={{Option}}
            onChange={(opt) => {
                scenarioStorage.setCurrentRevision(opt.value);
                // setSearchParams({revision: opt.value});
            }}
            value={currentValue}
            options={options}
            onCreateOption={(name) => scenarioStorage.createRevision({name})}
            formatCreateLabel={(input) => `Создать новую ${input}`}
            classNamePrefix="input-select"
            isSearchable={true}
            placeholder="Название сценарной ветки"
        />
    );
};
