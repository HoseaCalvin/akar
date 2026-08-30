import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(
    prisma, 
    { 
      provider: "postgresql" 
    }
  ),
  emailAndPassword: { 
    enabled: true,
    disableSignUp: true
  },
  trustedOrigins: [process.env.CLIENT_ORIGIN!],
  plugins: [admin()],
});