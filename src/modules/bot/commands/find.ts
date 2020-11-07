import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { toLower, trim } from 'lodash';

const atlas: Object[] = require('../../../../resources/atlas.json');

interface DisplayPlayerInfo {
  system: number;
  gal: number;
  pos: number;
  planet: string;
  alliance: string;
  rank: string;
  moon: string;
}

export const findCommand = (message: Message, args: string[]) => {
  if (!args.length) {
    return message.channel.send(`Nieprawidłowa komenda! Wpisz !znajdz <nick_gracza>`);
  }

  const player = args[0];

  const fullPlayersInfo = atlas.filter((v) => {
    if (v.hasOwnProperty('Gracz (Status)')) {
      const name = v?.['Gracz (Status)'];
      if (typeof name === 'string') {
        return trim(toLower(name)) === trim(toLower(player));
      }

      return false;
    }
  });

  if (!fullPlayersInfo.length) {
    return message.channel.send(`Nie znaleziono gracza o nicku ${player}`);
  }

  const displayPlayerInfo = fullPlayersInfo.map<DisplayPlayerInfo>((v) => {
    let planetName: string = v['Planeta / Nazwa (Aktywność)'];
    planetName = planetName.replace(planetName.match(/\((.*?)\)/g)[0], '');

    return {
      system: v['Gal'],
      gal: v['System'],
      pos: v['Pos'],
      planet: planetName,
      alliance: v['Sojusz'],
      rank: v['Pozycja'],
      moon: v['Księżyc'],
    };
  });

  message.channel.send(
    `Gracz: ${player} ${
      !!displayPlayerInfo?.[0]?.alliance ? `należący do sojuszu ${displayPlayerInfo[0].alliance}` : ''
    } - znalezione planety (ładowanie może trwać parę sekund):`
  );

  // const links = displayPlayerInfo.map((v) => `[${v.gal}:${v.system}:${v.pos} - ${v.planet}](https://mirkogame.pl/game.php?page=galaxy&galaxy=${v.gal}&system=${v.system})`)
  displayPlayerInfo
    .map((v) => {
      return new MessageEmbed({
        title: `${v.gal}:${v.system}:${v.pos} - ${v.planet}`,
        url: `https://mirkogame.pl/game.php?page=galaxy&galaxy=${v.gal}&system=${v.system})`,
        description: `${!!v.moon ? `Przy planecie znajduje się księżyc: ${v.moon}` : ''}`,
      });
    })
    .forEach((v: MessageEmbed) => message.channel.send(v));

  return message.channel.send('Uwaga! Wpisy z atlasu nie działają w czasie rzeczywistym!');
};
