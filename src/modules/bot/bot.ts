import { kebabCase, toLower } from 'lodash';
import { Client, Message, Role } from 'discord.js';
import { PREFIX } from '../../utils/consts';

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
        const commandType = args.shift().toLowerCase();

        if (!['dodaj', 'usun'].includes(commandType)) {
          return message.channel.send(`Nieprawidłowa komenda! Wpisz !rola <dodaj/usun> <nazwa_roli></nazwa_roli>`);
        }

        const roleNameKebab = args.map(toLower).join('-');

        const role = message.guild.roles.cache.find((v: Role) => kebabCase(v.name) === roleNameKebab);

        if (!role) return;

        const hasRole = !!message.member.roles.cache.find((v: Role) => v.id === role.id);

        if (commandType === 'dodaj') {
          if (hasRole) {
            return message.channel.send('Posiadasz już tę rolę!');
          }

          message.member.roles.add(role.id);

          return message.channel.send(`Rola >${role.name}< dodana!`);
        }

        if (commandType === 'usun') {
          if (!hasRole) {
            return message.channel.send('Nie posiadasz tej roli!');
          }

          message.member.roles.remove(role.id);

          return message.channel.send(`Rola >${role.name}< usunięta!`)
        }
      }
    })

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
    })
  }

  public _login(): Promise<string> {
    return this.client.login(process.env.BOT_TOKEN);
  }
}
