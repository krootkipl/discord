import { GuildMember, Permissions } from 'discord.js';

export const checkPermission = (member: GuildMember, permission: number) => {
  return member.hasPermission(permission);
}