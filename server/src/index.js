import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

const url = "mongodb://localhost:27017";

mongoose.connect(url, { dbName: 'Solar-System' })
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(`DB failed: ${err}`));

app.listen(3000, () => console.log('Server is listening on http://localhost:3000 ...'));
