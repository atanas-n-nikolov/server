import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import i18next from './i18n.js';
import i18nextMiddleware from 'i18next-http-middleware';
import { authMiddleware } from './middleware/authMiddleware.js';
import getError from './utils/getError.js';

const app = express();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(cookieParser());

app.use(i18nextMiddleware.handle(i18next))
app.use(authMiddleware);

app.use(routes);

app.use(async (err, req, res, next) => {
  const { message, statusCode } = await getError(err);
  res.status(statusCode).json({ error: message });
});

const url = process.env.MONGO_URI || "mongodb://localhost:27017";
mongoose.connect(url, { dbName: 'Planets' })
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(`DB failed: ${err}`));

app.listen(3000, () => console.log('Server is listening on http://localhost:3000 ...'));
