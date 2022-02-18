import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export const initI18n = () => {
    i18n
        .use(initReactI18next)
        .use(
            resourcesToBackend((language, namespace, callback) => {
                import(`../codgen/tanker/${language}/${namespace}.json`)
                    .then(({default: resources}) => {
                        callback(null, resources);
                    })
                    .catch((error) => {
                        callback(error, null);
                    });
            })
        )
        .init({
            lng: 'ru',
            fallbackLng: 'ru',
            defaultNS: 'obshchee',
            interpolation: {
                escapeValue: false,
            },
            // react: {
            //     useSuspense: false,
            // },
        });
};
