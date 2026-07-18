import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.route.js';
import authRouter from './routes/auth.route.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);

// Centralized error handler
app.use(errorHandler);

export default app;
