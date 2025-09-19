import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import {
  Auth0ContextType,
  ActionMap,
  AuthState,
  AuthUser,
} from "../types/auth";
import {
  auth0Config as auth0ConfigLocalEnv,
  DATA_CRYPT_SECRET_KEY,
  environment,
} from "../config";
import { auth0ConfigTestEnv } from "../config";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateRandomStateString,
} from "./pkce";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Typography } from "@mui/material";
import { getToken, removeToken, saveToken } from "../helpers/saveToken";
import { encryptData } from "../helpers/crypt";
import { useTranslation } from "react-i18next";
import { getUserFromStorage } from "../helpers/storage";

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";

export const env = environment;

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

type AuthActionTypes = {
  [INITIALIZE]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  //   [UPDATE]: {
  //     customer: Customer;
  //   };
  [SIGN_IN]: {
    user: AuthUser;
  };
  [SIGN_OUT]: undefined;
};

type Auth0Actions =
  ActionMap<AuthActionTypes>[keyof ActionMap<AuthActionTypes>];

const reducer = (state: AuthState, action: Auth0Actions) => {
  if (action.type === INITIALIZE) {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }
  //   if (action.type === UPDATE) {
  //     const { customer } = action.payload;
  //     return {
  //       ...state,
  //       customer,
  //     };
  //   }
  if (action.type === SIGN_IN) {
    const { user } = action.payload;
    return { ...state, isAuthenticated: true, user };
  }
  if (action.type === SIGN_OUT) {
    return {
      ...state,
      isAuthenticated: false,
      isInitialized: true,
      user: null,
    };
  }
  return state;
};

const AuthContext = createContext<Auth0ContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

 const auth0Config = useMemo(() => {
  // Always use the hardcoded config regardless of environment
  return {
    clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
    domain: 'https://ssotest.demirbank.kg',
    clientSecret: import.meta.env.VITE_APP_AUTH_CLIENT_SECRET,
    redirectUri: 'https://dhb-test.vercel.app'
  };
}, []);

  const handleOAuthRedirect = useCallback(async () => {
    const code = new URLSearchParams(window.location.search).get("code");
    const codeVerifier = sessionStorage.getItem("codeVerifier");

    if (code) {
      const tokenUrl = `${auth0Config.domain}/token`;
      const clientId = auth0Config.clientId;
      const clientSecret = auth0Config.clientSecret;
      //const redirectUri = auth0Config.redirectUri;
      const redirectUri = 'https://dhb-test.vercel.app'; 

      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("prompt", "login");
      params.append("code", code);
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);
      params.append("redirect_uri", redirectUri);
      params.append("code_verifier", codeVerifier as string);

      try {
        const response = await axios.post(tokenUrl, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        const accessToken =
          response.data.access_token || getToken("accessToken", env);
        const refreshToken = response.data.refresh_token;
        const expiresIn = response.data.expires_in; // in seconds
        const expiresAt = Date.now() + expiresIn * 1000;
        saveToken(String(expiresAt), "sessionExpire", env);
        saveToken(refreshToken, "refreshToken", env);
        if (accessToken) {
          saveToken(accessToken, "accessToken", env);

          const userData: AuthUser = jwtDecode(response.data.id_token);
          const lang = userData?.preffered_lang;
          if (lang && ["kg", "ru", "tr", "en"].includes(lang)) {
            i18n.changeLanguage(lang);
            localStorage.setItem("ibLang", lang);
          }
          saveToken(encryptData(userData, DATA_CRYPT_SECRET_KEY), "user", env);
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: true, user: userData },
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error exchanging the authorization code: ", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, auth0Config]);

  const signIn = useCallback(async () => {
    const codeVerifier = generateCodeVerifier();
    sessionStorage.setItem("codeVerifier", codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const state = generateRandomStateString();
    sessionStorage.setItem("oauthState", state);
    const authorizationUrl = auth0Config.domain + "/authorize";
    const clientId = auth0Config.clientId;
    const redirectUri = auth0Config.redirectUri;
    const scope = "openid offline_access profile email phone gateway_api";
    const lang = localStorage.getItem("ibLang") || i18n.language || "ky";

    const authUrl = `${authorizationUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${encodeURIComponent(
      state
    )}&code_challenge=${codeChallenge}&code_challenge_method=S256&prompt=login&lang=${lang}`;

    window.location.href = authUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    auth0Config.clientId,
    auth0Config.domain,
    auth0Config.redirectUri,
    // i18n.language,
  ]);

  useEffect(() => {
    if (
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    ) {
      handleOAuthRedirect();
    } else {
      const accessToken = getToken("accessToken", env);
      
      if (accessToken) {
        const user = getUserFromStorage();
        
        if (user && !state.isAuthenticated) {
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: true, user },
          });
          dispatch({ type: SIGN_IN, payload: { user: user || null } });
        }
      } else {
        // Check if we're on the logout page to prevent automatic redirect
        const isOnLogoutPage =
          window.location.pathname.includes("/auth/logout");
        const hasLogoutReason = window.location.search.includes("tag=");

        if (!isOnLogoutPage || (isOnLogoutPage && !hasLogoutReason)) {
          signIn();
        } else {
          dispatch({ type: SIGN_OUT });
        }
      }
    }
  }, [handleOAuthRedirect, signIn, state.isAuthenticated]);

  const signOut = () => {
    removeToken("accessToken", env);
    removeToken("refreshToken", env);
    removeToken("customerType", env);
    sessionStorage.removeItem("codeVerifier");

    const logoutUrl = `${
      auth0Config.domain
    }/logout?post_logout_redirect_uri=${encodeURIComponent(
      auth0Config.redirectUri
    )}`;
    window.location.href = logoutUrl;
    dispatch({ type: SIGN_OUT });
  };

  const resetPassword = (email: string) => {
    console.log(email);
  };

  //   const setCustomer = (customer: ICustomer) => {
  //     dispatch({ type: UPDATE, payload: { customer } });
  //   };

  return state.isInitialized ? (
    <AuthContext.Provider
      value={{
        ...state,
        method: "auth0",
        user: {
          id: state?.user?.sub,
          avatar: state?.user?.picture,
          email: state?.user?.email,
          displayName: state?.user?.name,
          role: "user",
          ...state.user,
        },
        signIn,
        signOut,
        resetPassword,
        // setCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  ) : (
    <Typography textAlign="center" fontSize={96} color="gray" marginTop="20%">
      Initializing...
    </Typography>
  );
}

export { AuthContext, AuthProvider };
