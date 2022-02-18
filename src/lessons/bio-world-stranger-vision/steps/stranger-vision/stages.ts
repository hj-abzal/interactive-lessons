import {useSmartViewportWrapper} from '@/context-providers/smart-viewport-wrapper';
import {useChat} from '@/context-providers/chat';
import {sleep, useStages} from '@/utils/use-stages';
import {useSberclass} from '@/context-providers/sberclass';

export function useLesson({
    setTransform,
    setFilter,
    setObject,
    setLayerSad,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLayerUnderwater,
    setIsUnderWater,
    setShownScene,
    removeShownScene,
    setIsGolubVision,
}) {
    const {typeMessage, clearMessages, blurMessages, setButtons} = useChat();
    const {setBgColor} = useSmartViewportWrapper();
    const sberclass = useSberclass();
    const {stagesIds, runStage, currentStage} = useStages({
        async start({runStage}) {
            clearMessages();
            setBgColor('#9edbf2');
            setLayerSad(0, {filter: false});
            setFilter('none');
            setTransform('scale(1.7) translate(-0%, -10%)');
            setObject('pchela', {
                isHidden: true,
            });
            setObject('kot', {
                x: 18,
                y: 63,
                isHidden: true,
            });
            setObject('riba', {
                isHidden: true,
                isUnclickable: true,
            });
            setObject('golub', {
                isUnclickable: true,
            });
            setObject('delfin', {
                isHidden: true,
            });
            setButtons([]);
            await sleep(500);
            await typeMessage({
                delay: 1000,
                text: `Добро пожаловать в необычный зверинец! 
                Здесь собраны удивительные животные — точнее, 
                эти животные обладают удивительными суперспособностями!`,
            });

            await typeMessage({
                delay: 1500,
                text: 'Не веришь? Давай выясним!',
            });
            await typeMessage({
                delay: 1500,
                text: 'Нажми Начать, чтобы выяснить.',
            });
            setButtons([{
                label: 'Начать!',
                onClick: () => runStage('golubIntro'),
            }]);
        },
        async golubIntro() {
            setButtons([]);
            setTransform('scale(1.7) translate(-0%, -10%)');
            clearMessages();
            await sleep(500);
            await typeMessage({
                delay: 1000,
                text: `Сейчас ты видишь мир обычным, человеческим взглядом. 
                Посмотри внимательно — есть ли здесь другие животные?`,
            });
            await typeMessage({
                delay: 2000,
                text: `Голуби и многие другие птицы обладают очень широким полем зрения. 
                Они видят предметы не только перед собой, как мы, люди, но и сбоку и даже немного позади от себя.`,
            });
            await sleep(2000);
            await typeMessage({
                delay: 1000,
                text: 'Нажми Вжух!, чтобы посмотреть глазами голубя.',
            });

            setButtons([{
                label: 'Вжух!',
                onClick: () => runStage('golubVision'),
            }]);
        },
        async golubVision() {
            setButtons([]);
            setObject('golub', {
                isHidden: true,
            });
            setObject('kot', {
                isHidden: false,
            });
            setObject('pchela', {
                isHidden: false,
            });
            setTransform('scale(1) translate(0%, 0%)');
            setFilter('saturate(1.8)');
            setIsGolubVision(true);
            clearMessages();
            await sleep(500);
            await typeMessage({
                delay: 1000,
                text: `Ого! Да это же кошка – естественный враг голубя в природе! 
                Хорошо, что с таким полем зрения ему легко её заметить и спастись!  
                Но кошка — тоже супергерой животного мира.`,
            });
            await sleep(5000);

            return 'kotIntro';
        },
        async kotIntro() {
            await sleep(100);
            setLayerSad(0, {filter: 'saturate(1) grayscale(0.9) brightness(0.05) contrast(1)'});
            setFilter('saturate(1) grayscale(0.3) brightness(0.2)');
            await typeMessage({
                delay: 1000,
                text: `Ночью даже с широким полем зрения особенно ничего не разглядишь. 
                Кошки — это ночные животные, и их глаза устроены так, чтобы видеть в темноте. `,
            });
            await sleep(4000);
            await typeMessage({
                delay: 1000,
                text: 'Нажми Вжух!, чтобы стать кошкой.',
            });

            setButtons([{
                label: 'Вжух!',
                onClick: () => runStage('kotVision'),
            }]);
        },
        async kotVision() {
            setButtons([]);
            setObject('kot', {
                isHidden: true,
            });
            setObject('golub', {
                isHidden: false,
            });
            setIsGolubVision(false);
            setTransform('scale(1.7) translate(-0%, -10%)');
            setLayerSad(0, {filter: 'grayscale(0.9) brightness(0.15) contrast(1) hue-rotate(-50deg)'});
            setFilter('grayscale(0) brightness(0.8) hue-rotate(50deg)');
            clearMessages();
            await sleep(500);

            await typeMessage({
                delay: 1000,
                tag: 'kotVisionPromt',
                text: `Стало получше, верно? Теперь можно и добычу заметить,
                и от опасности вовремя убежать.`,
            });
            await sleep(2000);
            await typeMessage({
                delay: 3000,
                text: `Хоть кошки и умеют видеть в темноте, но они могут различать только два цвета — 
                в отличие от людей, которые различают три цвета.`,
            });
            blurMessages('kotVisionPromt');
            await sleep(4000);
            return 'pchelaIntro';
        },
        async pchelaIntro() {
            await typeMessage({
                delay: 1000,
                text: 'А вот пчёлы видят невидимое: ультрафиолет.',
            });
            setLayerSad(0, {filter: false});
            setFilter('none');
            setTransform('scale(1.9) translate(-20%, -10%)');
            await typeMessage({
                delay: 2500,
                text: `Для человека и тем более для кошки в этих цветах нет ничего особенного. 
                А для пчелы?`,
            });
            await sleep(4000);
            blurMessages();
            await typeMessage({
                delay: 1000,
                text: 'Нажми Вжух!, чтобы стать пчелой.',
            });

            setButtons([{
                label: 'Вжух!',
                onClick: () => runStage('pchelaVision'),
            }]);
        },
        async pchelaVision() {
            setButtons([]);
            setObject('pchela', {
                isHidden: true,
            });
            setObject('tsvetokUltrafiolet', {
                isHidden: false,
            });
            setObject('tsvetok', {
                isHidden: true,
            });
            setObject('kot', {
                isHidden: false,
            });
            setFilter('sepia(0.6) brightness(0.68) hue-rotate(185deg) contrast(6.3)');

            setObject('tsvetokUltrafiolet', {
                filter: 'sepia(1.6) brightness(1.68) hue-rotate(-185deg) contrast(0,16)',
            });
            clearMessages();
            await sleep(500);
            await typeMessage({
                delay: 1000,
                text: `Пчёлы, в отличие от людей, не могут видеть красный цвет, 
                однако отлично видят незаметный нам ультрафиолет! Считается, 
                что пчёлы используют ультрафиолетовые метки на лепестках цветов, 
                чтобы попасть к нектару.`,
            });
            await sleep(10000);

            return 'underWaterIntro';
        },
        async underWaterIntro() {
            setBgColor('#9edbf2');
            setTransform('scale(1.9) translate(20%, -23%)');
            setFilter('none');
            setObject('tsvetokUltrafiolet', {
                isHidden: true,
            });
            setObject('tsvetok', {
                isHidden: false,
            });
            setObject('golub', {
                isHidden: true,
            });
            setObject('pchela', {
                isHidden: true,
            });
            setObject('kot', {
                isHidden: true,
            });
            setObject('delfin', {
                isHidden: false,
            });
            setObject('riba', {
                isHidden: false,
            });
            clearMessages();
            await sleep(500);
            await typeMessage({
                delay: 1000,
                text: `И птицы, и кошки, и пчёлы не могли бы видеть под водой – 
                устройство их глаз приспособлено к воздушной среде. А как видят рыбы?`,
            });
            setShownScene('prud');
            await sleep(4000);
            await typeMessage({
                delay: 1000,
                text: 'Нажми Плюх! чтобы нырнуть в пруд.',
            });
            setButtons([{
                label: 'Плюх!',
                onClick: () => runStage('underWaterHumanVision'),
            }]);
        },
        async underWaterHumanVision() {
            setFilter('blur(20px)');
            setIsUnderWater(true);
            setBgColor('#2b9fa9');
            setButtons([]);
            removeShownScene('sad');
            setTransform('none');
            await typeMessage({
                delay: 1000,
                text: `Вода поглощает и отражает лучи света, 
                поэтому предметы под водой кажутся искаженными. 
                С человеческим зрением тут особо ничего не разглядишь, верно? `,
            });
            await typeMessage({
                delay: 2000,
                text: 'Нажми Вжух! чтобы посмотреть по-рыбьи.',
            });
            setButtons([{
                label: 'Вжух!',
                onClick: () => runStage('underWaterFishVision'),
            }]);
        },

        async underWaterFishVision() {
            setFilter('none');
            setButtons([]);

            setObject('riba', {
                isHidden: true,
            });

            clearMessages();
            await sleep(500);
            await typeMessage({
                delay: 1000,
                text: 'Другой обитатель водной среды – дельфин – тоже хорошо видит под водой.',
            });
            await typeMessage({
                delay: 2000,
                text: `И рыбы, и дельфины видят под водой лучше людей. 
                Зато люди лучше видят в воздушной среде. Или нет? `,
            });
            setShownScene('sad');
            await typeMessage({
                delay: 1000,
                text: 'Нажми Расплюх! чтобы вынырнуть.',
            });
            setButtons([{
                label: 'Расплюх!',
                onClick: () => runStage('overWaterFishVision'),
            }]);
        },
        async overWaterFishVision() {
            setBgColor('#9edbf2');
            setTransform('scale(1.9) translate(20%, -23%)');
            setFilter('blur(10px)');
            setIsUnderWater(false);
            setButtons([]);

            clearMessages();
            removeShownScene('prud');
            await sleep(500);
            await typeMessage({
                delay: 1000,
                text: `Рыбам на воздухе делать нечего. Давай скорее посмотрим, 
                как себя чувствует дельфин?`,
            });
            await typeMessage({
                delay: 1000,
                text: 'Нажми Вжух!, чтобы стать дельфином.',
            });
            setButtons([{
                label: 'Вжух!',
                onClick: () => runStage('overWaterDolphinVision'),
            }]);
        },
        async overWaterDolphinVision() {
            setObject('delfin', {
                isHidden: true,
            });
            setObject('riba', {
                isHidden: true,
            });
            setFilter('none');
            setLayerSad(0, {filter: 'blur(210px)'});
            setLayerSad(1, {filter: 'blur(160px)'});
            setLayerSad(2, {filter: 'blur(100px)'});
            setLayerSad(3, {filter: 'blur(20px)'});
            setLayerSad(4, {filter: 'blur(8px)'});
            setLayerSad(5, {filter: 'blur(0px)'});
            setIsUnderWater(false);
            setButtons([]);

            clearMessages();
            await sleep(500);
            await typeMessage({
                delay: 1000,
                text: `Дельфины дышат воздухом, периодически всплывая на поверхность, 
                чтобы сделать вдох через дыхало, расположенное на темени. 
                Поэтому им важно хорошо видеть не только в воде, но и над её поверхностью.`,
            });
            await typeMessage({
                delay: 1000,
                text: 'Нажми Вжух! чтобы вернуться в человеческий облик!',
            });

            setButtons([{
                label: 'Вжух!',
                onClick: () => runStage('overWaterHumanFinal'),
            }]);
        },
        async overWaterHumanFinal() {
            setLayerSad(0, {filter: null});
            setLayerSad(1, {filter: null});
            setLayerSad(2, {filter: null});
            setLayerSad(3, {filter: null});
            setLayerSad(4, {filter: null});
            setLayerSad(5, {filter: null});
            setObject('delfin', {
                isHidden: false,
            });
            setObject('kot', {
                isHidden: false,
            });
            setObject('pchela', {
                isHidden: false,
            });
            setButtons([]);

            clearMessages();
            await sleep(1000);
            await typeMessage({
                delay: 1000,
                text: `Особенности органов чувств разных живых существ связаны с теми условиями, 
                в которых они живут. Сегодня ты получил представление о том, как разные животные 
                приспосабливаются к ночной жизни, жизни под водой, на границе сред и какие 
                приспособления им нужны для добывания пищи и защиты от опасности. `,
            });
            setButtons([{
                label: 'Начать с начала',
                onClick: () => runStage('start'),
            }]);

            sberclass.sendTaskResultRequest('ACCEPTED');
        },
    });

    return {stagesIds, runStage, currentStage};
}
