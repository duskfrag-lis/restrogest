import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { initSocket } from './config/socket';
import authRoutes from './modules/auth/auth.routes';
import usersRouter from './modules/users/users.routes';
import passport from './config/passport';
import menuRoutes from './modules/menu/menu.routes';
import profileRoutes from './modules/profile/profile.routes';
import tablesRoutes from './modules/tables/tables.routes';
import ordersRoutes from './modules/orders/orders.routes';
import kitchenRoutes from './modules/kitchen/kitchen.routes';
import deliveryRoutes from './modules/delivery/delivery.routes';
import reservationsRoutes from './modules/reservations/reservations.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import paymentsRoutes from './modules/payments/payments.routes';

const app = express();
const httpServer = createServer(app);
const PORT = Number(process.env.PORT) || 3000;

initSocket(httpServer);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/menu', menuRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentsRoutes);


app.get('/health', (_req, res) => {
    res.json({ status: 'ok', project: 'RestroGest' });
});

app.listen(PORT, () => {
    console.log(`RestroGest backend corriendo en puerto ${PORT}`);
});

export default app;
