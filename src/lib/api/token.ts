const ACCESS = "bixx.accessToken";
const REFRESH = "bixx.refreshToken";

const store = () => (typeof window === "undefined" ? null : window.localStorage);

export const getAccessToken = () => store()?.getItem(ACCESS) ?? null;

export const getRefreshToken = () => store()?.getItem(REFRESH) ?? null;

export function setTokens(accessToken: string, refreshToken?: string) {
  store()?.setItem(ACCESS, accessToken);
  if (refreshToken) store()?.setItem(REFRESH, refreshToken);
  window.dispatchEvent(new Event("bixx.auth"));
}

export function clearTokens() {
  store()?.removeItem(ACCESS);
  store()?.removeItem(REFRESH);
  window.dispatchEvent(new Event("bixx.auth"));
}
