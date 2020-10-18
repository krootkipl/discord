"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./modules/bot/bot");
const internalClient = new bot_1.InternalClient();
const bot = new bot_1.Bot();
internalClient.ready();
bot.listen();
//# sourceMappingURL=index.js.map