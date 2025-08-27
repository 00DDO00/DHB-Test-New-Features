import { AxiosResponse } from "axios";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocalizations } from "../services/_localizationsApi";

export const setLocalizations = () => {
  getLocalizations()
    .then((res: AxiosResponse) => {
      const locals = res.data;
      localStorage.setItem("dhbIbLocals", JSON.stringify(locals));

      const resourceData: { [x: string]: any } = {};
      locals.forEach((local: any) => {
        i18next.addResourceBundle(
          local.culture,
          "namespace",
          local.localizations
        );
        resourceData[local.culture] = local.localizations;
      });

      const resources = {
        en: {
          translation: {
            Search: "Search topics…",
            "Welcome back": "Welcome back",
            "We've missed you": "We've missed you",
            ...resourceData["en" as unknown as keyof typeof resourceData],
          },
        },
        nl: {
          translation: {
            Search: "Издоо…",
            "Welcome back": "Кайра кел",
            "We've missed you": "Сагындырдын",
            ...resourceData["nl" as unknown as keyof typeof resourceData],
          },
        },
        de: {
          translation: {
            Search: "Поиск…",
            "Welcome back": "Добро пожаловать назад",
            "We've missed you": "Мы скучали по тебе",
            ...resourceData["de" as unknown as keyof typeof resourceData],
          },
        },
      };

      const lang = localStorage.getItem("dhbLang") || "en";

      i18next.use(initReactI18next).init({
        resources,
        lng: lang,
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
      });
    })
    .catch((err) => console.log(err));
};
