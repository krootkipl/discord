const { prefix } = require('../config.json');
import { Client, Message } from 'discord.js';

export class Bot {
  public listen(): Promise<string> {
    const client = new Client();
    const clientLogin = new ClientLogin();

    client.on('message', (message: Message) => {
      if (!message.content.startsWith(prefix) || message.author.bot) return;

      const args = message.content.slice(prefix.length).trim().split(' ');
      const command = args.shift().toLowerCase();
    
      if (command === 'role') {
        console.log('message.guild.roles: ', message.guild.roles.cache.find(v => v.name === 'Gala 1').name);
      }
    })

    return clientLogin.login();
  }
}

export class ClientLogin {
  public login(): Promise<string> {
    const client = new Client();

    return client.login('NzY2Nzc4MDY0MTMzNjg1MjUw.X4oTuA.ZQl42LcV0jzkHfeioVsI0sqtGhU');
  }
}