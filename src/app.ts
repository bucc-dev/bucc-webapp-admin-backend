import express from 'express';
import cors from 'cors';
import { config } from "dotenv";
import cookieParser from 'cookie-parser';
import https from 'https';
import mongoose from 'mongoose';
import router from "./routes";
import cache from './utils/cache';

config();

const app = express();

const port: number = Number(process.env.PORT) || 3000;
const host: string = '0.0.0.0';
const serverURL: string = process.env.BACKEND_URL || `http://localhost:${port}`;

mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => console.log('MongoDB is connected'))
    .catch(error => {
        console.log(`Failed to connect to mongodb: ${error}`);
    });

const allowedOrigins = ['http://0.0.0.0:3000', serverURL];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(port, host, () => {
    console.log(`Listening on http://localhost:${port}`);
});

// to keep render and redis alive
setInterval(async () => {
    if (serverURL) {
        https.get(`${serverURL}/api/v1/ping`).on('error', (error) => {
            console.error('Error pinging server:', error);
        });
    }

    if (cache.connected) {
        await cache.client.set('keep-alive-key', 'keep-alive-value', { EX: 15 * 60 });
    }
},  15 * 60 * 1000); // 15 minutes
