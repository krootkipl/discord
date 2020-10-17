'use strict';
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');

client.once('ready', () => {
  console.log('Ready!');
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.filter(ch => ch.name === 'member-log');

  if (!channel) return;

  channel.send('Witaj w Sojuszu COVID 5G! Pamiętaj, koronawirus to ściema, 5G powoduje raka, a szczepionki autyzm!');
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'role') {
    message.channel.send(message.member.roles)
  }
});

client.login(process.env.BOT_TOKEN);
