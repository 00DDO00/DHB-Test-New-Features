// pkce.js
const generateRandomString = () => {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
    ""
  );
};

const sha256 = async (plain: any) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await window.crypto.subtle.digest("SHA-256", data);
  return hash;
};

const base64urlencode = (a: any) => {
  return btoa(
    String.fromCharCode.apply(null, new Uint8Array(a) as unknown as any)
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const generateCodeVerifier = () => generateRandomString();

export const generateCodeChallenge = async (verifier: any) => {
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
};
export const generateRandomStateString = (length = 32) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
