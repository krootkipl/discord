import { Bot } from './modules/bot/bot';
import { initAtlas } from './utils/helpers/atlas';
require('dotenv').config({ path: './.env.local' });

initAtlas();

const bot = new Bot();
bot.listen();

