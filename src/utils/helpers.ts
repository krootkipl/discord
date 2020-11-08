import { GuildMember, Permissions, Role } from 'discord.js';

export const checkPermission = (member: GuildMember, permission: number) => member.hasPermission(permission);

export const checkIfHasRoleByID = (member: GuildMember, id: string) => !!member.roles.cache.find((v: Role) => v.id === id);
