"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyClient = exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const consts_1 = require("../../utils/consts");
const find_1 = require("./commands/find");
const kalkulator_1 = require("./commands/kalkulator");
const role_1 = require("./commands/role");
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
                return role_1.roleCommand(message, args);
                // } else if {
                //   command === 'ban'
            }
            else if (command === 'kalkulator') {
                return kalkulator_1.kalkCommand(message);
            }
            else if (command === 'znajdz') {
                return find_1.findCommand(message, args);
            }
            else {
                return message.channel.send('Nieznana komenda! Dostępne komendy to: !rola, !kalkulator, !znajdz');
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
        return this.client.login(process.env.BOT_TOKEN);
    }
}
exports.MyClient = MyClient;
//# sourceMappingURL=bot.js.map