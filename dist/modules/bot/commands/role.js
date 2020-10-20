"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleCommand = void 0;
const discord_js_1 = require("discord.js");
const lodash_1 = require("lodash");
const helpers_1 = require("../../../utils/helpers");
exports.roleCommand = (message, args) => {
    if (!args.length) {
        return message.channel.send(`Nieprawidłowa komenda! Wpisz !rola <dodaj/usun> <nazwa_roli>`);
    }
    const commandType = args.shift().toLowerCase();
    if (!helpers_1.checkPermission(message.member, discord_js_1.Permissions.FLAGS.MANAGE_ROLES)) {
        return message.channel.send(`Nie masz uprawnień do zarządzania rolami!`);
    }
    if (!['dodaj', 'usun'].includes(commandType)) {
        return message.channel.send(`Nieprawidłowa komenda! Wpisz !rola <dodaj/usun> <nazwa_roli>`);
    }
    const mentions = !!message.mentions.users.size;
    if (!mentions) {
        return message.channel.send(`Musisz podać użytkowników którym chcesz dodać / usunąć role!`);
    }
    message.mentions.users.forEach((v) => {
        const index = args.findIndex((arg) => arg.includes(v.id));
        args.splice(index, 1);
    });
    const roleName = args.map(lodash_1.toLower).join('');
    const role = message.guild.roles.cache.find((v) => v.name.split(' ').join('').toLowerCase() === roleName);
    if (!role) {
        return message.channel.send(`Nie znaleziono podanej roli!`);
    }
    message.mentions.users.forEach((v) => {
        const guildMember = message.guild.members.cache.find((g) => g.id === v.id);
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
const addRoleForMember = (guildMember, role, message) => {
    if (!!guildMember.roles.cache.find((r) => r.id === role.id)) {
        message.channel.send(`Użytkownik ${guildMember.nickname} posiada już rolę ${role.name}!`);
        return;
    }
    guildMember.roles.add(role);
    message.channel.send(`Rola ${role.name} nadana użytkownikowi ${guildMember.user.username}`);
};
const removeRoleForMember = (guildMember, role, message) => {
    if (!guildMember.roles.cache.find((r) => r.id === role.id)) {
        message.channel.send(`Użytkownik ${guildMember.nickname} nie posiada roli ${role.name}!`);
        return;
    }
    guildMember.roles.remove(role);
    message.channel.send(`Rola ${role.name} usunięta użytkownikowi ${guildMember.user.username}`);
};
//# sourceMappingURL=role.js.map