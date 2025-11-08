import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth';
import { restaurantsRouter } from './routes/restaurants';
import { passwordResetRouter } from './routes/password-reset';

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/auth', passwordResetRouter);
app.use('/api/restaurants', restaurantsRouter);

app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
