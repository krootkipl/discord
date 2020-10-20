"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./modules/bot/bot");
require('dotenv').config({ path: './.env.local' });
const bot = new bot_1.Bot();
bot.listen();
//# sourceMappingURL=index.js.map