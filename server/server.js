import dotenv from 'dotenv';

import app from './app.js';
import connectDB from './utils/connectDB.js';

dotenv.config({ path: './config.env' });

const { PORT, DB_URL, NODE_ENV } = process.env;
console.log(NODE_ENV);

connectDB(DB_URL);

const server = app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}...`);
});
