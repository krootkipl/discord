const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
})

client.on('message', message => {
  if (message.content === '!covid') {
    message.channel.send('NIE ISTNIEJE');
  }
});

client.login(process.env.BOT_TOKEN);