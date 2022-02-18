import {createRoutes} from '@/utils/routes';

export const appRouter = createRoutes({
    home: {
        path: '/',
        component: () => null,
    },
    iframeView: {
        path: '/iframe/:lessonId',
    },
    iframeConstructorView: {
        path: '/iframe-constructor/:namespaceSlug/:scenarioSlug',
    },
    constructorView: {
        path: '/constructor-view/:namespaceSlug/:scenarioSlug',
        defaultParams: {
            scenarioSlug: 'unknown',
            namespaceSlug: 'unknown',
        },
    },
    constructor: {
        path: '/constructor/:namespaceSlug/:scenarioSlug',
        defaultParams: {
            scenarioSlug: 'unknown',
            namespaceSlug: 'unknown',
        },
    },
});

// Dev роуты для неконструкторных интерактивов
// !!! WARNING - не вставляй сюда компоненты, тут только конфиг роутов, вставляй их в app.tsx
export const lessonsRouter = createRoutes({
    'eco-mixed-forest': {
        path: '/eco-mixed-forest',
        title: 'Экосистема смешанный лес и океан',
    },
    'eco-mixed-forest-trainer': {
        path: '/eco-mixed-forest-trainer',
        title: 'Экосистема смешанный лес и океан',
    },
    'bio-world-stranger-vision': {
        path: '/bio-world-stranger-vision',
        title: 'Мир глазами других',
    },
});
