import { createAuthClient } from "better-auth/react";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
  "http://localhost:5001";

export const DEMO_ACCOUNT = {
  email: "demo@gmail.com",
  password: "DemoPassword",
} as const;

export const FRONTEND_SESSION_COOKIE = "akar_session";

export function markFrontendSession() {
  document.cookie = `${FRONTEND_SESSION_COOKIE}=1; path=/; SameSite=Lax`;
}

export function clearFrontendSession() {
  document.cookie = `${FRONTEND_SESSION_COOKIE}=; path=/; Max-Age=0`;
}

export const authClient = createAuthClient({
  baseURL: backendUrl,
  fetchOptions: {
    credentials: "include",
  },
});
