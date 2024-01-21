import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import UrlRoutes from './routers/UrlRouters';
import { startServer } from './startMongooseFunc/startServer';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/tinyurl', UrlRoutes);

startServer();

export default app;
