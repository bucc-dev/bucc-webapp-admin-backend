import express from 'express';
import cors from 'cors';
import { config } from "dotenv";
import router from "./routes";

config();

const app = express();

const port: number = Number(process.env.PORT) || 3000;
const host: string = '0.0.0.0';

const allowedOrigins: string[] = [host];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(port, host, () => {
    console.log(`Listening on http://localhost:${port}`);
});
