import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./configs/auth";
import authRouter from "./routes/auth.routes";
import akarRouter from "./routes/akar.routes";

dotenv.config({ 
    path: path.resolve(__dirname, "../.env") 
});

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,              
}));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use("/api/auth", authRouter);

app.use(express.json());
app.use("/api", akarRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
