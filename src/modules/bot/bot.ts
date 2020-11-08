import { Client, Message, MessageEmbed } from 'discord.js';

import { PREFIX, ROLA_FLOCIARZ_ID } from '../../utils/consts';
import { checkIfHasRoleByID } from '../../utils/helpers';
import { findCommand } from './commands/find';
import { kalkCommand } from './commands/kalkulator';
import { roleCommand } from './commands/role';

export class Bot {
  public listen() {
    const client = new Client();
    const myClient = new MyClient(client);

    myClient._ready();

    client.on('message', (message: Message) => {
      if (!message.content.startsWith(PREFIX) || message.author.bot) return;

      const args = message.content.slice(PREFIX.length).trim().split(' ');
      const command = args.shift().toLowerCase();

      if (!command.length) {
        return null;
      }

      if (!checkIfHasRoleByID(message.member, ROLA_FLOCIARZ_ID)) {
        if (message.member.id !== '381202451740622849') {
          message.channel.send('Masz, poczęstuj się... nie dla psa, kurwaaaa!');
          return message.channel.send('https://www.wykop.pl/cdn/c3201142/comment_hQTwVCV9joPqjdeJevpSwHSHVaseCwG7.gif');
        }
      }

      if (command === 'rola') {
        return roleCommand(message, args);
        // } else if {
        //   command === 'ban'
      } else if (command === 'kalkulator') {
        kalkCommand(message);
      } else if (command === 'znajdz') {
        findCommand(message, args);
      } else {
        message.channel.send('Nieznana komenda! Dostępne komendy to: !rola, !kalkulator, !znajdz');
      }
    });

    myClient._login();
  }
}

export class MyClient {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public _ready(): void {
    console.log('client starting...');

    this.client.once('ready', () => {
      console.log('Ready!');
    });
  }

  public _login(): Promise<string> {
    return this.client.login(process.env.BOT_TOKEN);
  }
}
