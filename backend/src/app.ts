import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', project: 'RestroGest' });
});

app.listen(PORT, () => {
    console.log(`RestroGest backend corriendo en puerto ${PORT}`);
});

export default app;
