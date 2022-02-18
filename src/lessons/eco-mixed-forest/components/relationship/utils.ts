import {RelationType, SubRelationType} from '@/lessons/eco-mixed-forest/context/types';

export const allRelationTypes = [
    {
        type: RelationType.PredatorPrey,
        text: 'Хищник-жертва',
    },
    {
        type: 'none',
        text: 'Выбери тип отношений',
    }
];

export const allSubRelationTypes = [
    {
        type: SubRelationType.ResourcesWar,
        text: 'Отбирает ресурсы',
    },
    {
        type: 'none',
        text: 'Что делает',
    }
];

export enum MemberId {
    first = 'first',
    second = 'second',
}

export type SelectedRelations = {
    first: RelationType | 'none',
    second: RelationType | 'none',
}

export type SelectedSubRelations = {
    first: SubRelationType | 'none',
    second: SubRelationType | 'none',
}

export enum steps {
    relations = 0,
    subRelations = 1,
    done = 2,
}

export const getTaskStep = (
    state: any,
    relations: SelectedRelations,
    subRelations: SelectedSubRelations
) => {
    const {membersRelations} = state.targetRelationPair;

    const relationsPassed = relations.first === membersRelations.first.relationType
        && relations.second === membersRelations.second.relationType;

    const subRelationPassed = subRelations.first === membersRelations.first.subRelationType
        && subRelations.second === membersRelations.second.subRelationType;

    if (!relationsPassed) {
        return {
            id: steps.relations,
            options: allRelationTypes,
        };
    }

    if (relationsPassed && !subRelationPassed) {
        return {
            id: steps.subRelations,
            options: allSubRelationTypes,
        };
    }

    return {
        id: steps.done,
    };
};

export const getTextByType = (
    rel: RelationType | SubRelationType | 'none',
    allTypes: typeof allRelationTypes | typeof allSubRelationTypes
) => allTypes
    .find((config) => config.type === rel)?.text;
