import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.route.js';
import authRouter from './routes/auth.route.js';
import profileRouter from './routes/profile.route.js';
import organizationRouter from './routes/organization.route.js';
import uploadRouter from './routes/upload.route.js';
import vehicleRouter from './routes/vehicle.route.js';
import rideRouter from './routes/ride.route.js';
import bookingRouter from './routes/booking.route.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/organization', organizationRouter);
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/rides', rideRouter);
app.use('/api/v1/bookings', bookingRouter);

// Centralized error handler
app.use(errorHandler);

export default app;

