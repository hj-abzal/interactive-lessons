/* eslint-disable */

// т.н Табл 1 из Notion
import {OceanMemberType, RelationType} from '@/lessons/eco-mixed-forest/context/types';

export const relationTypeText = (type: RelationType) => textsTable1.find((item) => item.type === type) || textsTable1[0];

export const textsTable1 = [
    {
        type: "конкуренция",
        typeznak: "-/-",
        definition: "Это отношения, в которых оба организма угнетают друг друга.",
        task1:
            'Как думаешь, между какими двумя организмами устанавливаются отношения по типу **"конкуренция"**? В таких отношениях два организма конкурируют друг с другом за одни и те же ресурсы, пищу, территорию. Выбери два подходящих организма.',
        mistake:
            "Эти организмы не конкурируют друг с другом за общие ресурсы: пищу, территорию.",
        help:
            "**Косатка** и **акула**, например, являются конкурентами: они охотятся на одну и ту же добычу.",
        helpTypes: [OceanMemberType.KillerWhale, OceanMemberType.Shark], // add animals
        task2:
            "Если эти два организма конкурируют друг с другом, то как ты думаешь, какой эффект каждый из них оказывает на другого?",
        effect:
            "Организмы конкурируют друг с другом за общие ресурсы, территорию и прочее. Значит, они оба влияют отрицательно друг на друга.",
        opredelenie: ""
    },
    {
        type: "хищник-жертва",
        typeznak: "+/-",
        definition:
            "Это отношения, в которых один организм получает пользу, причиняя при этом вред второму.",
        task1:
            'Как думаешь, между какими двумя организмами устанавливаются отношения по типу **"хищник-жертва"**? В таких отношениях один из организмов питается другим. Выбери два подходящих организм.',
        mistake: "В этой паре организмов один не питается другим.",
        help: "Мелкие рыбы являются добычей крупных хищников.",
        helpTypes: [OceanMemberType.KillerWhale, OceanMemberType.Perch], // add animals
        task2:
            "Если один организм охотится на другой, то как ты думаешь, какой эффект каждый из них оказывает на другого?",
        effect:
            "Хищник оказывает отрицательное действие на своих жертв, т.к. убивает их. А жертвы оказывают положительное действие на хищника, т.к. являются пищей для них.",
        opredelenie: ""
    },
    {
        type: "паразит-хозяин",
        typeznak: "+/-",
        definition:
            "Это отношения, в которых один организм получает пользу, причиняя при этом вред второму.",
        task1:
            'Как думаешь, между какими двумя организмами устанавливаются отношения по типу **"паразит-хозяин"**? В таких отношениях один использует другого, как среду обитания и источник пищи. Выбери два подходящих организма.',
        mistake:
            "В этой паре организмов один не использует другого, как среду обитания и источник пищи.",
        help: "**Миноги** являются паразитами **рыб**.",
        helpTypes: [OceanMemberType.Lamprey, OceanMemberType.Perch], // add animals
        task2:
            "Если один организм живет за счет другого, то как ты думаешь, какой эффект каждый из них оказывает на другого?",
        effect:
            "**Минога** является паразитом и оказывает отрицательное действие на **рыбу**, т.к. вызывает ее гибель. А **рыба** оказывает положительное действие на паразита, т.к. является для него хозяином - т.е. источником пищи.",
        opredelenie: ""
    },
    {
        type: "протокооперация",
        typeznak: "+/+",
        definition:
            "Это случай взаимовыгодных отношений, в которых оба получают пользу.",
        task1:
            'Как думаешь, между какими двумя организмами устанавливаются отношения по типу **"протокооперация"**? В таких отношениях два организма приносят пользу друг другу, хотя могут существовать отдельно? Выбери два подходящих организма.',
        mistake: "Эти организмы не приносят друг другу взаимную выгоду.",
        help:
            "**Актиния** и **рак‐отшельник** помогают друг другу успешнее выживать, хотя существовать по-отдельности они тоже могут.",
        helpTypes: [OceanMemberType.Actinia, OceanMemberType.HermitCrab], // add animals
        task2:
            "Если эти два организма приносят пользу друг другу, то как ты думаешь, какой эффект каждый из них оказывает на другого?",
        effect:
            "**Актиния** оказывает положительное действие на **рака-отшельника**, т.к. защищает его. **рак‐отшельник** тоже оказывает положительное действие на **актинию**, т.к. помогает ей передвигаться и питаться.",
        opredelenie: ""
    },
    {
        type: "нейтрализм",
        typeznak: "0/0",
        definition:
            "Это отношения, в которых организмы не взаимодействуют друг с другом.",
        task1:
            'Как думаешь, между какими организмами устанавливаются отношения по типу **"нейтрализм"**? В таких отношениях оба организма никак не взаимодействуют друг с другом. Выбери два подходящих организма\n',
        mistake: "Эти организмы взаимодействуют друг с другом.",
        help:
            "**Актиния** и **кит** не оказывают никакого воздействия друг на друга.",
        helpTypes: [OceanMemberType.Actinia, OceanMemberType.Whale], // add animals
        task2:
            "Если в этой паре организмы не взаимодействуют, то как ты думаешь, какой эффект каждый из них оказывает на другого?",
        effect:
            "Эти организмы никак не взаимодействуют, поэтому оба нейтрально относятся друг к другу.",
        opredelenie: ""
    },
    {
        type: "комменсализм",
        typeznak: "+/0",
        definition:
            "Это отношения, в которых один организм получает пользу, а другой организм не затрагивается.",
        task1:
            'Как думаешь, между какими организмами устанавливаются отношения по типу **"комменсализм"**? В таких отношениях один организм получает пользу от отношений, а другой ничего. Выбери два подходящих организма.',
        mistake:
            "В отношениях этих двух организмов не наблюдается односторонней выгоды.",
        help:
            "В этой паре **акула** транспортирует и защищает **рыб прилипал**, а они в ответ не оказывают влияние на акулу.",
        helpTypes: [OceanMemberType.Suckerfish, OceanMemberType.Shark], // add animals
        task2:
            "Если в этой паре только один организм влияет на другой (приносит пользу), то как ты думаешь, какой эффект каждый из них оказывает на другого?",
        effect:
            "В этой паре только один организм влияет на другой (приносит пользу).",
        opredelenie: ""
    }
];
