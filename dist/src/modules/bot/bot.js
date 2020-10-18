"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalClient = exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const consts_1 = require("../../../utils/consts");
class Bot {
    constructor() {
        this.internalClient = new InternalClient();
    }
    listen() {
        const client = new discord_js_1.Client();
        client.on('message', (message) => {
            if (!message.content.startsWith(consts_1.PREFIX) || message.author.bot)
                return;
            const args = message.content.slice(consts_1.PREFIX.length).trim().split(' ');
            const command = args.shift().toLowerCase();
            if (command === 'role') {
                console.log('message.guild.roles: ', message.guild.roles.cache.find(v => v.name === 'Gala 1').name);
            }
        });
        return this.internalClient.login();
    }
}
exports.Bot = Bot;
class InternalClient {
    constructor() {
        this.client = new discord_js_1.Client();
    }
    ready() {
        this.client.once('read', () => {
            console.log('Ready!');
        });
    }
    login() {
        return this.client.login('NzY2Nzc4MDY0MTMzNjg1MjUw.X4oTuA.ZQl42LcV0jzkHfeioVsI0sqtGhU');
    }
}
exports.InternalClient = InternalClient;
//# sourceMappingURL=bot.js.map