import { Bot } from './modules/bot/bot';
require('dotenv').config({path:'./.env.local'});

const bot = new Bot();


bot.listen();
