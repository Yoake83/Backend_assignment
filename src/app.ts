import express from 'express';
import quoteRoutes from './routes/quoteRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/', quoteRoutes);
app.use(errorHandler); // must be last

export default app;