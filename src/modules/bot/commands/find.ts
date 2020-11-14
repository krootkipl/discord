import { MessageEmbed, Permissions } from 'discord.js';
import { Message } from 'discord.js';
import { find, toLower, trim, uniq } from 'lodash';
import { checkPermission } from '../../../utils/helpers';

const atlas: Object[] = require('../../../../resources/atlas.json');

interface DisplayPlayerInfo {
  gal: number;
  sys: number;
  pos: number;
  player: string;
  status: string;
  planet: string;
  alliance: string;
  rank: string;
  moon: string;
}

export const findCommand = (message: Message, args: string[]) => {
  if (!args.length) {
    return message.channel.send(
      `Nieprawidłowa komenda! Wpisz !znajdz <nick_gracza>\n-k > parametr do szukania po koordynatach (np. !znajdz [4:171:6] -k)\n-k > parametr do szukania graczy po nazwie sojuszu (np. !znajdz co5g -s) - ważne! należy wpisać nazwę taką jak w widoku galaktyki!`
    );
  }

  if (args.includes('-k')) {
    return _findPlanetsByCordinates(message, args);
  }

  if (args.includes('-s')) {
    return _findPlayersByAlliance(message, args);
  }

  return _findPlanetsByPlayerName(message, args[0]);
};

const _findPlanetsByPlayerName = (message: Message, player: string) => {
  const fullPlayersInfo = atlas.filter((v) => {
    if (v.hasOwnProperty('Gracz')) {
      const name = v?.['Gracz'];

      return typeof name === 'string' ? trim(toLower(name)) === trim(toLower(player)) : false;
    }
  });

  if (!fullPlayersInfo.length) {
    return message.channel.send(`Nie znaleziono gracza o nicku ${player}`);
  }

  let displayPlayerInfo = fullPlayersInfo.map<DisplayPlayerInfo>((v) => {
    return {
      gal: v['G'],
      sys: v['U'],
      pos: v['P'],
      player: v['Gracz'],
      status: v['Status'],
      planet: v['Nazwa'],
      alliance: v['Sojusz'] !== '-' ? v['Sojusz'] : '',
      rank: v['Ranking'],
      moon: v['Moon'],
    };
  });

  if (displayPlayerInfo.length > 20) {
    if (!displayPlayerInfo.some((v: DisplayPlayerInfo) => v.player === player)) {
      return message.channel.send(`Wpisz dokładniejszy nick, znalazłem ponad 20 wyników! Nie chcemy zaśmiecać chatu, prawda? :D`);
    } else {
      displayPlayerInfo = displayPlayerInfo.filter((v: DisplayPlayerInfo) => v.player === player); 
      message.channel.send(`Znalazłem ponad 20 wyników! Wyświetlę tylko te najtrafniejsze, wpisz dokładniejszy nick!`);
    }
  }

  const multiplePlayersInfo: { [player: string]: DisplayPlayerInfo[] } = {};

  displayPlayerInfo.forEach((v) => {
    if (!multiplePlayersInfo[v.player]) {
      multiplePlayersInfo[v.player] = [v];
    } else {
      multiplePlayersInfo[v.player].push(v);
    }
  });

  for (let [nick, data] of Object.entries(multiplePlayersInfo)) {
    const firstElm = data[0];
    const statusInfo = statusSelector(firstElm.status);

    message.channel.send(
      `Gracz ${nick}${statusInfo ? ` (${statusInfo})` : ''}${
        !!firstElm?.alliance ? ` należący do sojuszu ${firstElm.alliance}` : ''
      } - znalezione planety (ładowanie może trwać parę sekund):`
    );

    data
      .map(
        (x: DisplayPlayerInfo) =>
          new MessageEmbed({
            title: `${x.gal}:${x.sys}:${x.pos} - ${x.planet}`,
            url: `https://mirkogame.pl/game.php?page=galaxy&galaxy=${x.gal}&system=${x.sys})`,
            description: `${!!x.moon ? `Przy planecie znajduje się księżyc: ${x.moon}` : ''}`,
          })
      )
      .forEach((x: MessageEmbed) => message.channel.send(x));
  }

  return message.channel.send('Uwaga! Wpisy z atlasu nie działają w czasie rzeczywistym! Stan na 06.11.2020');
};

const _findPlanetsByCordinates = (message: Message, args: string[]) => {
  let coordinates = args.find((v) => v.match(/\[*[1-4]:[0-9]{1,3}:[0-9]{1,2}\]*/));

  if (!coordinates) {
    return message.channel.send('Koordynaty wpisane niepoprawnie! Przykłady => 1:2:3, [4:200:3]');
  }

  coordinates = coordinates.replace('[', '');
  coordinates = coordinates.replace(']', '');

  const splittedCoordinates = coordinates.split(':');

  const position = {
    gal: splittedCoordinates[0],
    sys: splittedCoordinates[1],
    pos: splittedCoordinates[2],
  };

  const foundPlanet = atlas.find(
    (v) => String(v?.['']) === position.gal && String(v?.['U']) === position.sys && String(v?.['P']) === position.pos
  );

  if (!foundPlanet || !foundPlanet?.['Gracz'].length) {
    return message.channel.send('Nie znaleziono planety na podanych koordynatach!');
  }

  return _findPlanetsByPlayerName(message, foundPlanet['Gracz']);
};

const _findPlayersByAlliance = (message: Message, args: string[]) => {
  const alliance = args[0];

  const alliedPlayers = uniq(
    atlas
      .filter((v) => {
        if (!v.hasOwnProperty('Sojusz')) {
          return false;
        }

        const _alliance = v['Sojusz'];

        return trim(toLower(_alliance)).includes(trim(toLower(alliance)));
      })
      .map((v) => v['Gracz'])
  )
    .sort()
    .join(', ');

  if (!alliedPlayers.length) {
    return message.channel.send('Nie znalezionio takiego sojuszu!');
  }

  return message.channel.send(alliedPlayers);
};

const statusSelector = (status: string) => {
  switch (status) {
    case 'i':
      return 'nieaktywny przynajmniej 7 dni';

    case 'I':
      return 'nieaktywny przynajmniej 30 dni';

    case 'u':
      return 'gracz na urlopie';

    default:
      return null;
  }
};
