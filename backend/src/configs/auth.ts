import dotenv from "dotenv";
import path from "path";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./db";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

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
  trustedOrigins: [process.env.CLIENT_ORIGIN!, "http://172.30.16.1:3000"],
  plugins: [admin()],
});
