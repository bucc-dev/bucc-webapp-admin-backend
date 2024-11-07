import express from 'express';
import cors from 'cors';
import { config } from "dotenv";
import { CustomError } from "./middleware/errorHandler";
import { Response, Request } from "express";
import { handleError } from "./middleware/errorHandler";
import router from "./routes";

config();

const app = express();

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

const allowedOrigins: string[] = [host];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use((err: CustomError, req: Request, res: Response) => {
    handleError(err, res);
});

app.listen(port, host, () => {
    console.log(`Listening on http://localhost:${port}`);
});
