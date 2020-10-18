"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyClient = exports.Bot = void 0;
const lodash_1 = require("lodash");
const discord_js_1 = require("discord.js");
const consts_1 = require("../../utils/consts");
class Bot {
    listen() {
        const client = new discord_js_1.Client();
        const myClient = new MyClient(client);
        myClient._ready();
        client.on('message', (message) => {
            if (!message.content.startsWith(consts_1.PREFIX) || message.author.bot)
                return;
            const args = message.content.slice(consts_1.PREFIX.length).trim().split(' ');
            const command = args.shift().toLowerCase();
            if (command === 'rola') {
                const commandType = args.shift().toLowerCase();
                if (!['dodaj', 'usun'].includes(commandType)) {
                    return message.channel.send(`Nieprawidłowa komenda! Wpisz !rola <dodaj/usun> <nazwa_roli></nazwa_roli>`);
                }
                const roleNameKebab = args.map(lodash_1.toLower).join('-');
                const role = message.guild.roles.cache.find((v) => lodash_1.kebabCase(v.name) === roleNameKebab);
                if (!role)
                    return;
                const hasRole = !!message.member.roles.cache.find((v) => v.id === role.id);
                if (commandType === 'dodaj') {
                    if (hasRole) {
                        return message.channel.send('Posiadasz już tę rolę!');
                    }
                    message.member.roles.add(role.id);
                    return message.channel.send(`Rola ${role.name} dodana!`);
                }
                if (commandType === 'usun') {
                    if (!hasRole) {
                        return message.channel.send('Nie posiadasz tej roli!');
                    }
                    message.member.roles.remove(role.id);
                    return message.channel.send(`Rola ${role.name} usunięta!`);
                }
            }
        });
        myClient._login();
    }
}
exports.Bot = Bot;
class MyClient {
    constructor(client) {
        this.client = client;
    }
    _ready() {
        console.log('client starting...');
        this.client.once('ready', () => {
            console.log('Ready!');
        });
    }
    _login() {
        return this.client.login('NzY2Nzc4MDY0MTMzNjg1MjUw.X4oTuA.ZQl42LcV0jzkHfeioVsI0sqtGhU');
    }
}
exports.MyClient = MyClient;
//# sourceMappingURL=bot.js.map