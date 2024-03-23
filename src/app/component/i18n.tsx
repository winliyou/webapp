import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "guessPlaceholder": "Guess a number",
                    "guessButton": "Guess",
                    "resetButton": "Reset"
                }
            },
            zh: {
                translation: {
                    "guessPlaceholder": "猜一个数字",
                    "guessButton": "猜测",
                    "resetButton": "重置"
                }
            }
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;