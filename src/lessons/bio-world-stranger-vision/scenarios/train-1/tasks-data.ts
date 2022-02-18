export enum VisionDescType {
    Clam = 'Прикреплённость к морскому дну',
    Dog = 'Дневной хищник',
    Gecko = 'Ночной хищник',
    Eagle = 'Летающий хищник',
    Heron = 'Наземный хищник, питающийся водной фауной',
    Shrimps = 'Придонный образ жизни',
}
export enum TrainerType {
    Second = 'second',
    First = 'first'
}
export type TasksType = {
    animal: string,
    inRussian: string,
    type: TrainerType.First | TrainerType.Second,
    scene: SceneType,
    message: string
}
type SceneType = {
    transform: string,
    filter: string,
    layerSadFilter: string | boolean,
    isGolubVision: boolean,
    isHeronVision: boolean,
    isUnderWater: boolean
}
export type ErrorMessageType = {
    animal: string,
    desc: string
}
export const visionDesc = [
    'Прикреплённость к морскому дну',
    'Дневной хищник',
    'Ночной хищник',
    'Летающий хищник',
    'Наземный хищник, питающийся водной фауной',
    'Придонный образ жизни'
];
export const tasks: TasksType[] = [
    {
        animal: 'глазами креветки',
        inRussian: VisionDescType.Shrimps,
        type: TrainerType.Second,
        scene: {
            transform: 'scale(1.9) translate(20%, -23%)',
            filter: '',
            layerSadFilter: false,
            isGolubVision: false,
            isHeronVision: false,
            isUnderWater: true,
        },
        message: `Креветки обитают в мутной воде, 
        и они приспособились улавливать даже совсем небольшой и рассеянный свет`,

    },
    {
        animal: 'глазами цапли',
        inRussian: VisionDescType.Heron,
        type: TrainerType.Second,
        scene: {
            transform: 'scale(1) translate(0%, 0%)',
            filter: 'saturate(1.8)',
            layerSadFilter: false,
            isGolubVision: false,
            isHeronVision: true,
            isUnderWater: false,
        },
        message: `Цапли и выпи имеют вытянутое вверх поле зрения.
         Это помогает не упустить добычу под клювом и не прозевать опасность сверху`,

    },
    {
        animal: 'глазами собаки',
        inRussian: VisionDescType.Dog,
        type: TrainerType.Second,
        scene: {
            transform: 'scale(1.7) translate(-0%, -10%)',
            filter: '',
            layerSadFilter: '',
            isGolubVision: false,
            isHeronVision: false,
            isUnderWater: false,
        },
        message: `Собаки — хищники, и для выслеживания добычи при погоне им важно хорошо видеть впереди себя
         и оценивать расстояние до добычи
        `,

    },
    {
        animal: 'глазами моллюска',
        inRussian: VisionDescType.Clam,
        type: TrainerType.Second,
        scene: {
            transform: 'scale(1.9) translate(20%, -23%)',
            filter: '',
            layerSadFilter: false,
            isGolubVision: false,
            isHeronVision: false,
            isUnderWater: true,
        },
        message: `Приблизительно так видит гигантская треуголка — огромный двустворчатый моллюск,
         который обитает на дне моря. Он не двигается и питается тем, 
         что пропускает через себя воду и задерживает плавающий в ней планктон. Зрение для него не очень важно`,

    },
    {
        animal: 'глазами геккона',
        inRussian: VisionDescType.Gecko,
        type: TrainerType.Second,
        scene: {
            transform: 'scale(1.7) translate(-0%, -10%)',
            filter: '',
            layerSadFilter: false,
            isGolubVision: false,
            isHeronVision: false,
            isUnderWater: false,
        },
        message: 'Гекконы — ночные хищники, и у в темноте они отлично различают свет и цвет',

    },
    {
        animal: 'глазами орла',
        inRussian: VisionDescType.Eagle,
        type: TrainerType.Second,
        scene: {
            transform: 'scale(1) translate(0%, 0%)',
            filter: 'saturate(1.8)',
            layerSadFilter: false,
            isGolubVision: false,
            isHeronVision: false,
            isUnderWater: false,
        },
        message: `У орлов очень острое зрение: на расстоянии 3 км орёл может видеть мышь!
         Кстати, птицы — тетрахроматы: они умеют видеть не только красный, зелёный и синий, но и ультрафиолет`,
    },
    {
        animal: 'golub',
        inRussian: 'Голубь',
        type: TrainerType.First,
        scene: {
            transform: 'scale(1) translate(0%, 0%)',
            filter: 'saturate(1.8)',
            layerSadFilter: false,
            isGolubVision: true,
            isHeronVision: false,
            isUnderWater: false,
        },
        message: `Поле зрения каждого глаза у голубя — 150–170°, но обоими глазами они видят лишь 20–30°.
        Зато летящая птица может видеть то, что делается перед ней, с боков, сзади и даже внизу.
         Это помогает голубям замечать опасность вовремя`,

    },
    {
        animal: 'kot',
        inRussian: 'Кошка',
        type: TrainerType.First,
        scene: {
            transform: 'scale(1.7) translate(-0%, -10%)',
            filter: 'grayscale(0) brightness(0.8) hue-rotate(50deg)',
            layerSadFilter: 'grayscale(0.9) brightness(0.15) contrast(1) hue-rotate(-50deg)',
            isGolubVision: false,
            isHeronVision: false,
            isUnderWater: false,
        },
        message: `Кошки отлично видят в условиях слабого освещения.
        Глаза кошки направлены вперёд, и их зрительные поля перекрываются.
         Это помогает им оценивать расстояние до предмета — как и нам, людям`,

    },
    {
        animal: 'riba',
        inRussian: 'Рыба',
        type: TrainerType.First,
        scene: {
            transform: 'scale(1.9) translate(20%, -23%)',
            filter: 'none',
            layerSadFilter: false,
            isGolubVision: false,
            isHeronVision: false,
            isUnderWater: true,
        },
        message: `Для человека под водой всё кажется мутным: наши глаза приспособлены для воздушной среды.
        А вот устройство глаз рыб позволяет им хорошо видеть под водой.
        Правда, острота зрения рыб неважная: их можно назвать близорукими`,

    },
    {
        animal: 'pchela',
        inRussian: 'Пчела',
        type: TrainerType.First,
        scene: {
            transform: 'scale(1.7) translate(-0%, -10%)',
            filter: 'sepia(0.6) brightness(0.68) hue-rotate(185deg) contrast(6.3)',
            layerSadFilter: false,
            isGolubVision: false,
            isHeronVision: false,
            isUnderWater: false,
        },
        message: `Пчёлы — пятиглазые! У них есть три небольших глаза на макушке и два огромных по бокам головы. 
        Огромные глаза состоят из ячеек — фасеток, благодаря которым пчёлы видят все как в замедленной съёмке. 
        Ещё пчёлы не видят красный цвет, но зато различают ультрафиолет. 
        Это помогает им видеть отметки на лепестках цветов, направляющие их к нектару`,

    }
];
