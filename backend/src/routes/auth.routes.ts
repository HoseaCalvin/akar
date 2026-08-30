import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../configs/auth";

const authRouter = Router();

authRouter.all("/{*splat}", toNodeHandler(auth));

export default authRouter;