const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', (message) => {
  switch (message) {
    case `!server`:
      message.channel.send(`Ten serwer nazywa się: ${message.guild.name}`);
      break;

    case `!covid`:
      message.channel.send('NIE ISTNIEJE');
      break;

    default:
      break;
  }
});

client.login(process.env.BOT_TOKEN);
