import mongoose, { ConnectOptions } from 'mongoose';
import { app } from '..';
import { deleteExpiredUrls } from '../utils/deleteExpiredUrls';

export const startServer = () => {
  const port = process.env.PORT;
  const urlDB = process.env.DATABASE_URL;

  return mongoose
    .connect(
      urlDB as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions,
    )
    .then(() => {
      console.log('Connected to MongoDB');

      app.listen(port, () => {
        console.log(`API available on http://localhost:${port}`);
      });
    })
    .catch((error: Error) => {
      console.log('Failed connecting to MongoDB:', error);
    });
};

setInterval(deleteExpiredUrls, 24 * 60 * 60 * 1000);
