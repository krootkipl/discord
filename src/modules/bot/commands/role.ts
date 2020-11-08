import { Collection, GuildMember, Message, Permissions, Role, User } from 'discord.js';
import { kebabCase, remove, toLower } from 'lodash';
import { measureMemory } from 'vm';
import { checkPermission } from '../../../utils/helpers';

export const roleCommand = (message: Message, args: string[]) => {
  if (!checkPermission(message.member, Permissions.FLAGS.MANAGE_ROLES)) {
    return message.channel.send(`Nie masz uprawnień do zarządzania rolami!`);
  }

  if (!args.length) {
    return message.channel.send(`Nieprawidłowa komenda! Wpisz !rola <dodaj/usun> <nicki_uzytkownikow> <nazwa_roli>`);
  }

  const commandType = args.shift().toLowerCase();

  if (!['dodaj', 'usun'].includes(commandType)) {
    return message.channel.send(`Nieprawidłowa komenda! Wpisz !rola <dodaj/usun> <nicki_uzytkownikow> <nazwa_roli>`);
  }

  const mentions = !!message.mentions.users.size;

  if (!mentions) {
    return message.channel.send(`Musisz podać użytkowników którym chcesz dodać / usunąć role!`);
  }

  message.mentions.users.forEach((v: User) => {
    const index = args.findIndex((arg) => arg.includes(v.id));
    args.splice(index, 1);
  });

  const roleName = args.map(toLower).join('');

  const role = message.guild.roles.cache.find((v: Role) => v.name.split(' ').join('').toLowerCase() === roleName);

  if (!role) {
    return message.channel.send(`Nie znaleziono podanej roli!`);
  }

  if (message.mentions.users.some((v: User) => v.id === '381202451740622849')) {
    message.channel.send('Nie kombinuj xD');
  }
  
  message.mentions.users.forEach((v: User) => {
    const guildMember = message.guild.members.cache.find((g: GuildMember) => g.id === v.id);
    if (!!guildMember) {
      if (commandType === 'dodaj') {
        addRoleForMember(guildMember, role, message);
      }

      if (commandType === 'usun') {
        removeRoleForMember(guildMember, role, message);
      }
    }
  });
};

const addRoleForMember = (guildMember: GuildMember, role: Role, message: Message) => {
  if (!!guildMember.roles.cache.find((r: Role) => r.id === role.id)) {
    return message.channel.send(`Użytkownik ${guildMember.nickname} posiada już rolę ${role.name}!`);
  }

  guildMember.roles.add(role);
  return message.channel.send(`Rola ${role.name} nadana użytkownikowi ${guildMember.user.username}`);
};

const removeRoleForMember = (guildMember: GuildMember, role: Role, message: Message) => {
  if (!guildMember.roles.cache.find((r: Role) => r.id === role.id)) {
    return message.channel.send(`Użytkownik ${guildMember.nickname} nie posiada roli ${role.name}!`);
  }

  guildMember.roles.remove(role);
  return message.channel.send(`Rola ${role.name} usunięta użytkownikowi ${guildMember.user.username}`);
};
