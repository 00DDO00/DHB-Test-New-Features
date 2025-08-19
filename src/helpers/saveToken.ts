export const saveToken = (
  token: string,
  key: string,
  env: "prod" | "test" | "local"
) => {
  if (env === "prod") {
    sessionStorage.setItem(key, token);
  } else if (env === "test") {
    sessionStorage.setItem(key, token);
  } else if (env === "local") {
    localStorage.setItem(key, token);
  }
};

export const getToken = (key: string, env: "prod" | "test" | "local") => {
  if (env === "prod") {
    return sessionStorage.getItem(key);
  } else if (env === "test") {
    return sessionStorage.getItem(key);
  } else if (env === "local") {
    return localStorage.getItem(key);
  }
};

export const removeToken = (key: string, env: "prod" | "test" | "local") => {
  if (env === "prod") {
    sessionStorage.removeItem(key);
  } else if (env === "test") {
    sessionStorage.removeItem(key);
  } else if (env === "local") {
    localStorage.removeItem(key);
  }
};
