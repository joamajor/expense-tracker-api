import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ApiRouter } from './routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/v1', ApiRouter.routes);

export default app;
