export enum ScenarioType {
    Simulator = 'Simulator',
}

export enum BiosphereType {
    Forest = 'Forest',
    Ocean = 'Ocean'
}

export enum ForestMemberType {
    Wolf = 'волк',
    Fox = 'лиса',
    Hare = 'заяц',
    Mushroom = 'шляпочный гриб',
    Snake = 'уж',
    Squirrel = 'белка',
    Frog = 'лягушка',
    Grass = 'трава',
    BirchSmall = 'береза (маленькая)',
    BirchBig = 'береза (большая)',
    Birch = 'береза',
    Fir = 'ель',
    FirSmall = 'ель (маленькая)',
    FirBig = 'ель (большая)',
    PolyPore = 'трутовик'
}

export enum OceanMemberType {
    Suckerfish = 'рыба‐прилипала',
    HermitCrab = 'рак‐отшельник',
    Lamprey = 'минога',
    KillerWhale = 'косатка',
    Perch = 'морской окунь',
    Actinia = 'актиния',
    Shark = 'акула',
    Whale = 'кит',
    Acorns = 'морские жёлуди'
}

export type MemberType = ForestMemberType | OceanMemberType;

export type AvailableMembersMap = {
    [key in MemberType]?: boolean;
}

// Во всех задачах фигурирует пара животных / растений
export enum MemberId {
    first = 'first',
    second = 'second',
}

/**
 * @see https://www.notion.so/5857ecb6a2f04cd899bf7d1a37999b54?v=cfaaa5a5e715448fafe169333a681eb2
 * @see https://www.notion.so/d809e363548f4c82a112b38ee0e86657?v=20ba12d308f14e1fb7e08567e941e4d2
 */
export enum RelationType {
    PredatorPrey = 'хищник-жертва',
    Competition = 'конкуренция',
    ParasiteOwner = 'паразит-хозяин',
    Protocooperation = 'протокооперация',
    Mutualism = 'мутуализм',
    Amensalism = 'аменсализм',
    Neutralism = 'нейтрализм',
    Commensalism = 'комменсализм',
}

export enum RoleMark {
    Plus = '+',
    Minus = '-',
    Zero = '0',
}

/**
 * @see https://www.notion.so/5857ecb6a2f04cd899bf7d1a37999b54?v=cfaaa5a5e715448fafe169333a681eb2
 * @see https://www.notion.so/d809e363548f4c82a112b38ee0e86657?v=20ba12d308f14e1fb7e08567e941e4d2
 */
export enum SubRelationType {
    ResourcesWar = 'отнимает ресурсы',
    SupplyMushroomNutrition = 'снабжает гриб готовыми питательными веществами',
    IncreaseAbsorbability = `
        своими гифами увеличивает общую всасывающую поверхность корней, 
        снабжая дерево достаточным количеством воды с минеральными веществами из почвы
    `,
    DestroyPlantTexture = 'Разрушает ткани растения',
    Hunt = 'охотится',
    BecomeFood = 'становится пищей',
    Nothing = 'не влияет',
    ObstructSunPositive = 'создает комфортные затененные условия для роста',
    ObstructSunNegative = 'плотной кроной создает недостаток света (плохие условия для роста)',
    Protect = 'защищает',
    SupplyNutrition = 'снабжает питательными веществами',
    MoveAndSupplyNutrition = 'передвигает и делится пищей',
    DestroyFishTexture = 'разрушает ткани рыбы',
    ProvideHousing = 'предоставляет жилище',
    ProvideHousingTransportAndProtect = 'предоставляет жилище, транспорт и защиту',
    ProvideHousingAndProtect = 'предоставляет жилище, транспорт',
}

export type MemberRelation = {
    memberType: MemberType,
    // Доп варианты типо Береза большая, береза маленькая для березы,
    memberTypeVariants?: MemberType[],
    subRelationType: SubRelationType,
    roleMark: RoleMark,
}

export type SimulationCoeffs = {
    // Рейт размножения
    a1: number,
    // Рейт встреч
    a2: number,
    // Заглухание
    a3: number,
    // Рейт размножения
    b1: number,
    // Рейт встреч
    b2: number,
    // Заглухание
    b3: number
};

export type MembersRelationsPair = {
    first: MemberRelation,
    second: MemberRelation,
}

export type EducationTask = {
    // Могут быть разные вариации на один тип отношений
    name: string,
    relationType: RelationType,
    members: AvailableMembersMap,
    targetPair: MembersRelationsPair,
}

export type TasksConfig = {
    biospheresRelations: {
        [key in BiosphereType]: EducationTask[]
    },
    trainerTasks: EducationTask[],
}
