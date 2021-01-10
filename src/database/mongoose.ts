import * as Mongoose from 'mongoose';
import * as express from 'express';
import { UserModel } from './users/usersModel';
import { FarmModel } from './farms/farmsModel';

let database: Mongoose.Connection;

export const mongoConnect = () => {
  const uri = `mongodb+srv://pepsik:${process.env.MONGODB_PASS}@discordbot.viiqw.mongodb.net/bot?retryWrites=true&w=majority`;
  const dbOptions: Mongoose.ConnectOptions = {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };

  if (database) {
    return;
  }

  Mongoose.connect(uri, dbOptions);

  database = Mongoose.connection;

  database.once('open', async () => {
    console.log('Connected to database');
  });

  database.on('error', (err) => {
    console.error('Error connecting to database');
    console.error(err);
  });

  return {
    UserModel,
    FarmModel,
  };
};

export const mongoDisconnect = () => {
  if (!database) {
    return;
  }

  Mongoose.disconnect();
};
