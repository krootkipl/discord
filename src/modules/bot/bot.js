"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientLogin = exports.Bot = void 0;
const { prefix } = require('../config.json');
const discord_js_1 = require("discord.js");
class Bot {
    listen() {
        const client = new discord_js_1.Client();
        const clientLogin = new ClientLogin();
        client.on('message', (message) => {
            if (!message.content.startsWith(prefix) || message.author.bot)
                return;
            const args = message.content.slice(prefix.length).trim().split(' ');
            const command = args.shift().toLowerCase();
            if (command === 'role') {
                console.log('message.guild.roles: ', message.guild.roles.cache.find(v => v.name === 'Gala 1').name);
            }
        });
        return clientLogin.login();
    }
}
exports.Bot = Bot;
class ClientLogin {
    login() {
        const client = new discord_js_1.Client();
        return client.login('NzY2Nzc4MDY0MTMzNjg1MjUw.X4oTuA.ZQl42LcV0jzkHfeioVsI0sqtGhU');
    }
}
exports.ClientLogin = ClientLogin;
//# sourceMappingURL=bot.js.map