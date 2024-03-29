import mongoose from 'mongoose';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Successfulyy connected to database.');
      })
      .catch((error) => {
        log.error('Error connecting to databae', error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
