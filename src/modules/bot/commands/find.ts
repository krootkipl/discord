import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { toLower, trim } from 'lodash';

const atlas: Object[] = require('../../../../resources/atlas.json');

interface DisplayPlayerInfo {
  player: string;
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

  if (args[0].length < 3) {
    return message.channel.send(`Wpisz przynajmniej 3 znaki nicku gracza!`);
  }

  const player = args[0];

  const fullPlayersInfo = atlas.filter((v) => {
    if (v.hasOwnProperty('Gracz (Status)')) {
      const name = v?.['Gracz (Status)'];
      if (typeof name === 'string') {
        return trim(toLower(name)).includes(trim(toLower(player)));
      }

      return false;
    }
  });

  if (!fullPlayersInfo.length) {
    return message.channel.send(`Nie znaleziono gracza o nicku ${player}`);
  }

  const displayPlayerInfo = fullPlayersInfo.map<DisplayPlayerInfo>((v) => {
    let planetName: string = v['Planeta / Nazwa (Aktywność)'];
    planetName = planetName.replace(planetName.match(/\((.*?)\)/g)?.[0] ?? '', '');

    return {
      player: v['Gracz (Status)'],
      system: v['Gal'],
      gal: v['System'],
      pos: v['Pos'],
      planet: planetName,
      alliance: v['Sojusz'],
      rank: v['Pozycja'],
      moon: v['Księżyc'],
    };
  });

  if (displayPlayerInfo.length > 30) {
    return message.channel.send(`Wpisz dokładniejszy nick, znalazłem ponad 30 wyników! Nie chcemy zaśmiecać chatu, prawda? :D`);
  }

  const multiplePlayersInfo: { [player: string]: DisplayPlayerInfo[] } = {};

  displayPlayerInfo.forEach((v) => {
    if (!multiplePlayersInfo[v.player]) {
      multiplePlayersInfo[v.player] = [v];
    } else {
      multiplePlayersInfo[v.player].push(v);
    }
  });

  Object.entries(multiplePlayersInfo).forEach((v: [string, DisplayPlayerInfo[]]) => {
    message.channel.send(
      `Gracz ${v[0]}${
        !!v[1][0]?.alliance ? ` należący do sojuszu ${v[1][0].alliance}` : ''
      } - znalezione planety (ładowanie może trwać parę sekund):`
    );

    v[1]
      .map((x: DisplayPlayerInfo) => {
        return new MessageEmbed({
          title: `${x.gal}:${x.system}:${x.pos} - ${x.planet}`,
          url: `https://mirkogame.pl/game.php?page=galaxy&galaxy=${x.gal}&system=${x.system})`,
          description: `${!!x.moon ? `Przy planecie znajduje się księżyc: ${x.moon}` : ''}`,
        });
      })
      .forEach((x: MessageEmbed) => message.channel.send(x));
  });

  return message.channel.send('Uwaga! Wpisy z atlasu nie działają w czasie rzeczywistym!');
};
