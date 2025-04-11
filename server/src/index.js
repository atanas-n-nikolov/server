import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(routes);

const url = process.env.MONGO_URI || "mongodb://localhost:27017";

mongoose.connect(url, { dbName: 'Planets' })
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(`DB failed: ${err}`));

app.listen(3000, () => console.log('Server is listening on http://localhost:3000 ...'));
