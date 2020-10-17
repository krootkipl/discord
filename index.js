const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', (message) => {
  if (message === `!server`) {
    message.channel.send(`Ten serwer nazywa się: ${message.guild.name}`);
  } else if (message === `!covid`) {
    message.channel.send('NIE ISTNIEJE');
  }
});

client.login(process.env.BOT_TOKEN);
