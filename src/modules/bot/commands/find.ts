import { Collection, GuildMember, Message, MessageEmbed, Permissions, Role, User } from 'discord.js';
import { kebabCase, remove, toLower } from 'lodash';
import { measureMemory } from 'vm';
import { checkPermission } from '../../../utils/helpers';

const atlas: Object[] = require('../../../../resources/atlas.json');

export const findCommand = (message: Message, args: string[]) => {
  if (!args.length) {
    return message.channel.send(`Nieprawidłowa komenda! Wpisz !znajdz <nick_gracza>`);
  }

  const player = args[0];
  console.log('player: ', player);

  const fullPlayersInfo = atlas.filter((v) => {
    if (v.hasOwnProperty('Gracz (Status)')) {
      const name = v?.['Gracz (Status)'];
      if (typeof name === 'string') {
        return name.includes(player);
      }

      return false;
    }
  });

  if (!!fullPlayersInfo.length) {
    return message.channel.send(`Nie znaleziono gracza o nicku ${player}`);
  }

  const displayPlayerInfo = fullPlayersInfo.map((v) => {
    return {
      system: v['Gal'],
      gal: v['System'],
      pos: v['Pos'],
      planet: v['Planeta / Nazwa (Aktywność)'],
      alliance: v['Sojusz'],
      rank: v['Pozycja'],
    };
  });

  message.channel.send(
    `Gracz: ${player} ${
      !!displayPlayerInfo[0].alliance.length ? `należący do sojuszu ${displayPlayerInfo[0].alliance}` : ''
    } - znalezione planety:`
  );

  return message.channel
    .send(
      displayPlayerInfo.map((v) => {
        return `${v.gal}:${v.system}:${v.pos} - ${v.planet} - https://mirkogame.pl/game.php?page=galaxy&galaxy=${v.gal}&system=${v.system}`;
      })
    )
    .then((v) => v.suppressEmbeds(true));
};
