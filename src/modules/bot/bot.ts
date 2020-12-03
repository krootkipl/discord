import { Client, Message, MessageEmbed } from 'discord.js';

import { BOT_CHANNEL_ID, PREFIX, ROLA_FLOCIARZ_ID } from '../../utils/consts';
import { checkIfHasRoleByID } from '../../utils/helpers';
import store from '../../utils/store';
import { findCommand } from './commands/find';
import { kalkCommand } from './commands/kalkulator';
import { roleCommand } from './commands/role';
import * as AtlasActions from './actions/atlasActions';
import { AtlasElement } from '../../utils/types/atlas';

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

      if (command === 'kalkulator') {
        return kalkCommand(message);
      }

      if (command === 'rola') {
        return roleCommand(message, args);
      }

      if (command === 'znajdz') {
        return findCommand(message, args);
      }

      return message.channel.send('Nieznana komenda!! Dostępne komendy to: !rola, !kalkulator, !znajdz');
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
