import { Client, Message } from 'discord.js';

import { PREFIX } from '../../utils/consts';
import { findCommand } from './commands/find';
import { kalkCommand } from './commands/kalkulator';
import { roleCommand } from './commands/role';

export class Bot {
  public listen(): void {
    const client = new Client();
    const myClient = new MyClient(client);

    myClient._ready();

    client.on('message', (message: Message) => {
      if (!message.content.startsWith(PREFIX) || message.author.bot) return;

      const args = message.content.slice(PREFIX.length).trim().split(' ');
      const command = args.shift().toLowerCase();

      if (command === 'rola') {
        return roleCommand(message, args);
        // } else if {
        //   command === 'ban'
      } else if (command === 'kalkulator') {
        return kalkCommand(message);
      } else if (command === 'znajdz') {
        return findCommand(message, args);
      } else {
        return message.channel.send('Nieznana komenda! Dostępne komendy to: !rola, !kalkulator');
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
