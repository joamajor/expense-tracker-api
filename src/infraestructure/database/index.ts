import mongoose from 'mongoose';
import { envs } from '../../config/envs';

mongoose
  .connect(envs.dbUrl, { dbName: envs.dbName })
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(-1);
  });
