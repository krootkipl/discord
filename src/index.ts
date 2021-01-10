import { mongoConnect } from './database/mongoose';
import { Bot } from './modules/bot/bot';
import { atlasInit } from './utils/helpers/atlas';

require('dotenv').config({ path: './.env.local' });

atlasInit();

export const db = mongoConnect();

const bot = new Bot();
bot.listen();
