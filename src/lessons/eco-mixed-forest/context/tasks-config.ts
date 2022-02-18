import {
    BiosphereType,
    ForestMemberType,
    OceanMemberType,
    RelationType,
    RoleMark,
    SubRelationType,
    TasksConfig
} from '@/lessons/eco-mixed-forest/context/types';

export const allForestMembers = Object.values(ForestMemberType).reduce((acc, type) => {
    if (type !== ForestMemberType.Grass) {
        acc[type] = true;
    } else {
        acc[type] = false;
    }

    return acc;
}, {});

// Потом нужно будет для океана
const allOceanMembers = Object.values(OceanMemberType).reduce((acc, type) => {
    acc[type] = true;

    return acc;
}, {});

export const tasksConfig: TasksConfig = {
    biospheresRelations: {
        [BiosphereType.Forest]: [
            {
                name: 'ель (большая)-береза (большая)',
                members: {
                    ...allForestMembers,
                    [ForestMemberType.FirSmall]: false,
                    [ForestMemberType.BirchSmall]: false,
                },
                relationType: RelationType.Competition,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.Fir,
                        memberTypeVariants: [ForestMemberType.FirBig],
                        subRelationType: SubRelationType.ResourcesWar,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: ForestMemberType.Birch,
                        memberTypeVariants: [ForestMemberType.BirchBig],
                        subRelationType: SubRelationType.ResourcesWar,
                        roleMark: RoleMark.Minus,
                    },
                },
            },
            {
                name: 'лиса-волк',
                members: {
                    ...allForestMembers,
                    [ForestMemberType.FirSmall]: false,
                    [ForestMemberType.BirchSmall]: false,
                },
                relationType: RelationType.Competition,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.Wolf,
                        subRelationType: SubRelationType.ResourcesWar,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: ForestMemberType.Fox,
                        subRelationType: SubRelationType.ResourcesWar,
                        roleMark: RoleMark.Minus,
                    },
                },
            },
            {
                name: 'береза-шляпочный гриб',
                members: allForestMembers,
                relationType: RelationType.Mutualism,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.Birch,
                        memberTypeVariants: [ForestMemberType.BirchBig],
                        subRelationType: SubRelationType.SupplyMushroomNutrition,
                        roleMark: RoleMark.Plus,
                    },
                    second: {
                        memberType: ForestMemberType.Mushroom,
                        subRelationType: SubRelationType.IncreaseAbsorbability,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'трутовик-береза',
                members: allForestMembers,
                relationType: RelationType.ParasiteOwner,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.PolyPore,
                        subRelationType: SubRelationType.DestroyPlantTexture,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: ForestMemberType.Birch,
                        memberTypeVariants: [ForestMemberType.BirchBig],
                        subRelationType: SubRelationType.SupplyNutrition,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'лиса-заяц',
                members: allForestMembers,
                relationType: RelationType.PredatorPrey,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.Fox,
                        subRelationType: SubRelationType.Hunt,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: ForestMemberType.Hare,
                        subRelationType: SubRelationType.BecomeFood,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'лиса-белка',
                members: allForestMembers,
                relationType: RelationType.PredatorPrey,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.Fox,
                        subRelationType: SubRelationType.Hunt,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: ForestMemberType.Squirrel,
                        subRelationType: SubRelationType.BecomeFood,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'волк-заяц',
                members: allForestMembers,
                relationType: RelationType.PredatorPrey,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.Wolf,
                        subRelationType: SubRelationType.Hunt,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: ForestMemberType.Hare,
                        subRelationType: SubRelationType.BecomeFood,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'волк-белка',
                members: allForestMembers,
                relationType: RelationType.PredatorPrey,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.Wolf,
                        subRelationType: SubRelationType.Hunt,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: ForestMemberType.Squirrel,
                        subRelationType: SubRelationType.BecomeFood,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'уж-лягушка',
                members: allForestMembers,
                relationType: RelationType.PredatorPrey,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.Snake,
                        subRelationType: SubRelationType.Hunt,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: ForestMemberType.Frog,
                        subRelationType: SubRelationType.BecomeFood,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'ель (маленькая)-береза (большая)',
                members: allForestMembers,
                relationType: RelationType.Commensalism,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.FirSmall,
                        subRelationType: SubRelationType.Nothing,
                        roleMark: RoleMark.Zero,
                    },
                    second: {
                        memberType: ForestMemberType.BirchBig,
                        subRelationType: SubRelationType.ObstructSunPositive,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'береза (маленькая)-ель (большая)',
                members: allForestMembers,
                relationType: RelationType.Amensalism,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.BirchSmall,
                        subRelationType: SubRelationType.Nothing,
                        roleMark: RoleMark.Zero,
                    },
                    second: {
                        memberType: ForestMemberType.FirBig,
                        subRelationType: SubRelationType.ObstructSunNegative,
                        roleMark: RoleMark.Minus,
                    },
                },
            },
            // Попросили убрать
            // {
            //     name: 'трава-ель (большая)',
            //     members: allForestMembers,
            //     relationType: RelationType.Amensalism,
            //     targetPair: {
            //         first: {
            //             memberType: ForestMemberType.Grass,
            //             subRelationType: SubRelationType.Nothing,
            //             roleMark: RoleMark.Zero,
            //         },
            //         second: {
            //             memberType: ForestMemberType.FirBig,
            //             subRelationType: SubRelationType.ObstructSunNegative,
            //             roleMark: RoleMark.Minus,
            //         },
            //     },
            // },
            {
                name: 'neutralism',
                members: allForestMembers,
                relationType: RelationType.Neutralism,
                targetPair: {
                    first: {
                        memberType: ForestMemberType.BirchBig,
                        subRelationType: SubRelationType.Nothing,
                        roleMark: RoleMark.Zero,
                    },
                    second: {
                        memberType: ForestMemberType.Wolf,
                        subRelationType: SubRelationType.Nothing,
                        roleMark: RoleMark.Zero,
                    },
                },
            }
        ],
        [BiosphereType.Ocean]: [
            {
                name: 'косатка-акула',
                members: allOceanMembers,
                relationType: RelationType.Competition,
                targetPair: {
                    first: {
                        memberType: OceanMemberType.KillerWhale,
                        subRelationType: SubRelationType.ResourcesWar,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: OceanMemberType.Shark,
                        subRelationType: SubRelationType.ResourcesWar,
                        roleMark: RoleMark.Minus,
                    },
                },
            },
            {
                name: 'атиния-рак‐отшельник',
                members: allOceanMembers,
                relationType: RelationType.Protocooperation,
                targetPair: {
                    first: {
                        memberType: OceanMemberType.Actinia,
                        subRelationType: SubRelationType.Protect,
                        roleMark: RoleMark.Plus,
                    },
                    second: {
                        memberType: OceanMemberType.HermitCrab,
                        subRelationType: SubRelationType.MoveAndSupplyNutrition,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'минога-морской окунь',
                members: allOceanMembers,
                relationType: RelationType.ParasiteOwner,
                targetPair: {
                    first: {
                        memberType: OceanMemberType.Lamprey,
                        subRelationType: SubRelationType.DestroyFishTexture,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: OceanMemberType.Perch,
                        subRelationType: SubRelationType.SupplyNutrition,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'косатка-морской окунь',
                members: allOceanMembers,
                relationType: RelationType.PredatorPrey,
                targetPair: {
                    first: {
                        memberType: OceanMemberType.KillerWhale,
                        subRelationType: SubRelationType.Hunt,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: OceanMemberType.Perch,
                        subRelationType: SubRelationType.BecomeFood,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'акула-морской окунь',
                members: allOceanMembers,
                relationType: RelationType.PredatorPrey,
                targetPair: {
                    first: {
                        memberType: OceanMemberType.Shark,
                        subRelationType: SubRelationType.Hunt,
                        roleMark: RoleMark.Minus,
                    },
                    second: {
                        memberType: OceanMemberType.Perch,
                        subRelationType: SubRelationType.BecomeFood,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'рыба‐прилипала-акула',
                members: allOceanMembers,
                relationType: RelationType.Commensalism,
                targetPair: {
                    first: {
                        memberType: OceanMemberType.Suckerfish,
                        subRelationType: SubRelationType.Nothing,
                        roleMark: RoleMark.Zero,
                    },
                    second: {
                        memberType: OceanMemberType.Shark,
                        subRelationType: SubRelationType.ProvideHousingTransportAndProtect,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'морские жёлуди-кит',
                members: allOceanMembers,
                relationType: RelationType.Commensalism,
                targetPair: {
                    first: {
                        memberType: OceanMemberType.Acorns,
                        subRelationType: SubRelationType.Nothing,
                        roleMark: RoleMark.Zero,
                    },
                    second: {
                        memberType: OceanMemberType.Whale,
                        subRelationType: SubRelationType.ProvideHousingAndProtect,
                        roleMark: RoleMark.Plus,
                    },
                },
            },
            {
                name: 'neutralism',
                members: allOceanMembers,
                relationType: RelationType.Neutralism,
                targetPair: {
                    first: {
                        memberType: OceanMemberType.Actinia,
                        subRelationType: SubRelationType.Nothing,
                        roleMark: RoleMark.Zero,
                    },
                    second: {
                        memberType: OceanMemberType.Whale,
                        subRelationType: SubRelationType.Nothing,
                        roleMark: RoleMark.Zero,
                    },
                },
            }
        ],
    },
    trainerTasks: [
        {
            name: 'ель (большая)-береза (большая)',
            members: allForestMembers,
            relationType: RelationType.Competition,
            targetPair: {
                first: {
                    memberType: ForestMemberType.FirBig,
                    subRelationType: SubRelationType.ResourcesWar,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: ForestMemberType.BirchBig,
                    subRelationType: SubRelationType.ResourcesWar,
                    roleMark: RoleMark.Minus,
                },
            },
        },
        {
            name: 'лиса-волк',
            members: allForestMembers,
            relationType: RelationType.Competition,
            targetPair: {
                first: {
                    memberType: ForestMemberType.Wolf,
                    subRelationType: SubRelationType.ResourcesWar,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: ForestMemberType.Fox,
                    subRelationType: SubRelationType.ResourcesWar,
                    roleMark: RoleMark.Minus,
                },
            },
        },
        {
            name: 'береза-шляпочный гриб',
            members: allForestMembers,
            relationType: RelationType.Mutualism,
            targetPair: {
                first: {
                    memberType: ForestMemberType.Birch,
                    memberTypeVariants: [ForestMemberType.BirchBig, ForestMemberType.BirchSmall],
                    subRelationType: SubRelationType.SupplyMushroomNutrition,
                    roleMark: RoleMark.Plus,
                },
                second: {
                    memberType: ForestMemberType.Mushroom,
                    subRelationType: SubRelationType.IncreaseAbsorbability,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'трутовик-береза',
            members: allForestMembers,
            relationType: RelationType.ParasiteOwner,
            targetPair: {
                first: {
                    memberType: ForestMemberType.PolyPore,
                    subRelationType: SubRelationType.DestroyPlantTexture,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: ForestMemberType.Birch,
                    memberTypeVariants: [ForestMemberType.BirchBig, ForestMemberType.BirchSmall],
                    subRelationType: SubRelationType.SupplyNutrition,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'лиса-заяц',
            members: allForestMembers,
            relationType: RelationType.PredatorPrey,
            targetPair: {
                first: {
                    memberType: ForestMemberType.Fox,
                    subRelationType: SubRelationType.Hunt,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: ForestMemberType.Hare,
                    subRelationType: SubRelationType.BecomeFood,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'лиса-белка',
            members: allForestMembers,
            relationType: RelationType.PredatorPrey,
            targetPair: {
                first: {
                    memberType: ForestMemberType.Fox,
                    subRelationType: SubRelationType.Hunt,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: ForestMemberType.Squirrel,
                    subRelationType: SubRelationType.BecomeFood,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'волк-заяц',
            members: allForestMembers,
            relationType: RelationType.PredatorPrey,
            targetPair: {
                first: {
                    memberType: ForestMemberType.Wolf,
                    subRelationType: SubRelationType.Hunt,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: ForestMemberType.Hare,
                    subRelationType: SubRelationType.BecomeFood,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'волк-белка',
            members: allForestMembers,
            relationType: RelationType.PredatorPrey,
            targetPair: {
                first: {
                    memberType: ForestMemberType.Wolf,
                    subRelationType: SubRelationType.Hunt,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: ForestMemberType.Squirrel,
                    subRelationType: SubRelationType.BecomeFood,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'уж-лягушка',
            members: allForestMembers,
            relationType: RelationType.PredatorPrey,
            targetPair: {
                first: {
                    memberType: ForestMemberType.Snake,
                    subRelationType: SubRelationType.Hunt,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: ForestMemberType.Frog,
                    subRelationType: SubRelationType.BecomeFood,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'ель (маленькая)-береза (большая)',
            members: allForestMembers,
            relationType: RelationType.Commensalism,
            targetPair: {
                first: {
                    memberType: ForestMemberType.FirSmall,
                    subRelationType: SubRelationType.Nothing,
                    roleMark: RoleMark.Zero,
                },
                second: {
                    memberType: ForestMemberType.BirchBig,
                    subRelationType: SubRelationType.ObstructSunPositive,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'береза (маленькая)-ель (большая)',
            members: allForestMembers,
            relationType: RelationType.Amensalism,
            targetPair: {
                first: {
                    memberType: ForestMemberType.BirchSmall,
                    subRelationType: SubRelationType.Nothing,
                    roleMark: RoleMark.Zero,
                },
                second: {
                    memberType: ForestMemberType.FirBig,
                    subRelationType: SubRelationType.ObstructSunNegative,
                    roleMark: RoleMark.Minus,
                },
            },
        },
        {
            name: 'косатка-акула',
            members: allOceanMembers,
            relationType: RelationType.Competition,
            targetPair: {
                first: {
                    memberType: OceanMemberType.KillerWhale,
                    subRelationType: SubRelationType.ResourcesWar,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: OceanMemberType.Shark,
                    subRelationType: SubRelationType.ResourcesWar,
                    roleMark: RoleMark.Minus,
                },
            },
        },
        {
            name: 'атиния-рак‐отшельник',
            members: allOceanMembers,
            relationType: RelationType.Protocooperation,
            targetPair: {
                first: {
                    memberType: OceanMemberType.Actinia,
                    subRelationType: SubRelationType.Protect,
                    roleMark: RoleMark.Plus,
                },
                second: {
                    memberType: OceanMemberType.HermitCrab,
                    subRelationType: SubRelationType.MoveAndSupplyNutrition,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'минога-морской окунь',
            members: allOceanMembers,
            relationType: RelationType.ParasiteOwner,
            targetPair: {
                first: {
                    memberType: OceanMemberType.Lamprey,
                    subRelationType: SubRelationType.DestroyFishTexture,
                    roleMark: RoleMark.Minus,
                },
                second: {
                    memberType: OceanMemberType.Perch,
                    subRelationType: SubRelationType.SupplyNutrition,
                    roleMark: RoleMark.Plus,
                },
            },
        },
        {
            name: 'косатка-морской окунь',
            members: allOceanMembers,
            relationType: RelationType.PredatorPrey,
            targetPair: {
                first: {
                    memberType: OceanMemberType.KillerWhale,
                    subRelationType: SubRelationType.Hunt,
                    roleMark: RoleMark.Plus,
                },
                second: {
                    memberType: OceanMemberType.Perch,
                    subRelationType: SubRelationType.BecomeFood,
                    roleMark: RoleMark.Minus,
                },
            },
        },
        {
            name: 'акула-морской окунь',
            members: allOceanMembers,
            relationType: RelationType.PredatorPrey,
            targetPair: {
                first: {
                    memberType: OceanMemberType.Shark,
                    subRelationType: SubRelationType.Hunt,
                    roleMark: RoleMark.Plus,
                },
                second: {
                    memberType: OceanMemberType.Perch,
                    subRelationType: SubRelationType.BecomeFood,
                    roleMark: RoleMark.Minus,
                },
            },
        },
        {
            name: 'рыба‐прилипала-акула',
            members: allOceanMembers,
            relationType: RelationType.Commensalism,
            targetPair: {
                first: {
                    memberType: OceanMemberType.Suckerfish,
                    subRelationType: SubRelationType.Nothing,
                    roleMark: RoleMark.Plus,
                },
                second: {
                    memberType: OceanMemberType.Shark,
                    subRelationType: SubRelationType.ProvideHousingTransportAndProtect,
                    roleMark: RoleMark.Zero,
                },
            },
        },
        {
            name: 'морские жёлуди-кит',
            members: allOceanMembers,
            relationType: RelationType.Commensalism,
            targetPair: {
                first: {
                    memberType: OceanMemberType.Acorns,
                    subRelationType: SubRelationType.Nothing,
                    roleMark: RoleMark.Plus,
                },
                second: {
                    memberType: OceanMemberType.Whale,
                    subRelationType: SubRelationType.ProvideHousingAndProtect,
                    roleMark: RoleMark.Zero,
                },
            },
        },
        {
            name: 'neutralism',
            members: allOceanMembers,
            relationType: RelationType.Neutralism,
            targetPair: {
                first: {
                    memberType: OceanMemberType.Actinia,
                    subRelationType: SubRelationType.Nothing,
                    roleMark: RoleMark.Zero,
                },
                second: {
                    memberType: OceanMemberType.Whale,
                    subRelationType: SubRelationType.Nothing,
                    roleMark: RoleMark.Zero,
                },
            },
        },
        {
            name: 'neutralism',
            members: allForestMembers,
            relationType: RelationType.Neutralism,
            targetPair: {
                first: {
                    memberType: ForestMemberType.BirchBig,
                    subRelationType: SubRelationType.Nothing,
                    roleMark: RoleMark.Zero,
                },
                second: {
                    memberType: ForestMemberType.Wolf,
                    subRelationType: SubRelationType.Nothing,
                    roleMark: RoleMark.Zero,
                },
            },
        }
    ],
};
