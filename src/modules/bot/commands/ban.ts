// import { Guild, GuildMember, Message, Permissions, Role } from 'discord.js';
// import { checkPermission } from '../../../utils/helpers';

// export const banCommand = (message: Message, args: string[]) => {
//   if (!args.length) {
//     return message.channel.send(`Nieprawidłowa komenda! Wpisz !ban <nicki_uzytkownikow>`);
//   }

//   if (!checkPermission(message.mentions, Permissions.FLAGS.BAN_MEMBERS)) {
//     return message.channel.send(`Nie masz uprawnień do banowania użytkowników!`);
//   }

//   const mentions = !!message.mentions.users.size;

//   if (!mentions) {
//     return message.channel.send('Musisz podać użytkowników których chcesz zbanować!');
//   }

//   message.mentions.users.forEach((v: User) => {
//     const guildMember = message.guild.members.cache.find((g: GuildMember) => g.id === v.id);

//     if (!!guildMember) {
//     }
//   });
// };

// const banMember = (guildMember: GuildMember, role: Role, message: Message) => {
//   guildMember.ban();

//   return message.channel.send(`Użytkownik ${guildMember.nickname} został zbanowany!`);
// };
