// /frontend/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react"; // or "better-auth/client" if not React

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});