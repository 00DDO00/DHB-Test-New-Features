import React, { useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { CacheProvider } from "@emotion/react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "./i18n";
import createTheme from "./theme";
import routes from "./routes";

import useTheme from "./hooks/useTheme";
import { store } from "./redux/store";
import createEmotionCache from "./utils/createEmotionCache";

import { AuthProvider } from "./contexts/AuthPkceContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { setLocalizations } from "./utils/localizations";
import { useTranslation } from "react-i18next";
// import { AuthProvider } from "./contexts/FirebaseAuthContext";
// import { AuthProvider } from "./contexts/Auth0Context";
// import { AuthProvider } from "./contexts/CognitoContext";

const clientSideEmotionCache = createEmotionCache();

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App({ emotionCache = clientSideEmotionCache }) {
  const content = useRoutes(routes);

  const { theme } = useTheme();

  useEffect(() => {
    setLocalizations();
  }, []);

  const { i18n } = useTranslation();
  const query = useQuery();

  useEffect(() => {
    // Set language from query param
    const lang = query.get("lang");
    if (lang && lang !== i18n.language && ["nl", "de", "en"].includes(lang)) {
      i18n.changeLanguage(lang);
      localStorage.setItem("dhbLang", lang);
    }
  }, [query, i18n]);

  return (
    <ErrorBoundary>
      <CacheProvider value={emotionCache}>
        <HelmetProvider>
          <Helmet
            titleTemplate="%s | Mira"
            defaultTitle="Mira - React Material Admin Dashboard"
          />
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MuiThemeProvider theme={createTheme(theme)}>
                <AuthProvider>{content}</AuthProvider>
              </MuiThemeProvider>
            </LocalizationProvider>
          </Provider>
        </HelmetProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}

export default App;
