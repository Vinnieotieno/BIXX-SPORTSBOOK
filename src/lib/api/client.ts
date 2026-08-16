import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./token";

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api-gateway").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ErrorBody = {
  message?: string;
  validationErrors?: Record<string, string> | string | null;
};

function tidy(value: string) {
  return value
    .replace(/\u2014|\u2013|&mdash;|&#8212;/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const FIELD_LABELS: Record<string, string> = {
  phone_number: "Phone",
  email: "Email",
  password: "Password",
  confirm_password: "Confirm password",
  verification_code: "Code",
};

function formatValidation(errors: Record<string, string>) {
  return Object.entries(errors)
    .map(([key, value]) => {
      const label = FIELD_LABELS[key] ?? key.replace(/_/g, " ");
      const text = tidy(String(value));
      if (!text) return "";
      return text.toLowerCase().startsWith(label.toLowerCase()) ? text : `${label}: ${text}`;
    })
    .filter(Boolean)
    .join(". ");
}

async function readError(response: Response) {
  const text = await response.text();
  try {
    const body = JSON.parse(text) as ErrorBody;
    if (body.validationErrors && typeof body.validationErrors === "object") {
      const fields = formatValidation(body.validationErrors);
      if (fields) return fields;
    }
    if (typeof body.validationErrors === "string" && body.validationErrors.trim()) {
      return tidy(body.validationErrors);
    }
    if (body.message) return tidy(body.message);
    return tidy(text) || response.statusText;
  } catch {
    return tidy(text) || response.statusText;
  }
}

async function send(path: string, init: RequestInit, token: string | null) {
  return fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: "omit",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
}

async function refreshSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await send(
    "/api/auth/refresh",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    },
    null,
  );

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = (await response.json()) as { accessToken: string; refreshToken?: string };
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

const skipRefresh = (path: string) => path.startsWith("/api/auth/");

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response = await send(path, init, getAccessToken());

  if (response.status === 401 && !skipRefresh(path)) {
    const token = await refreshSession();
    if (token) response = await send(path, init, token);
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readError(response));
  }

  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}
