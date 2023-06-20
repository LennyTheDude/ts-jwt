import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import router from './routes/index';
import errorMiddleware from './middlewares/error-middleware';

const sequelize = require('./models/index').sequelize;
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connection successful.');
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.error('Unable to connect to the database:', e);
    }
}

start();