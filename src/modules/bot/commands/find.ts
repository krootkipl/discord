import { EmbedFieldData, MessageEmbed, Permissions } from 'discord.js';
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
      `Nieprawidłowa komenda! Wpisz !znajdz <nick_gracza>\n
      -k > parametr do szukania po koordynatach (np. !znajdz [4:171:6] -k)\n
      -s > parametr do szukania graczy po nazwie sojuszu (np. !znajdz co5g -s) - ważne! należy wpisać nazwę taką jak w widoku galaktyki!`
    );
  }

  if (args.includes('-h')) {
    return message.channel.send(`Wpisz !znajdz <nick_gracza>\n
    -k > parametr do szukania po koordynatach (np. !znajdz [4:171:6] -k)\n
    -s > parametr do szukania graczy po nazwie sojuszu (np. !znajdz co5g -s) - ważne! należy wpisać nazwę taką jak w widoku galaktyki!`);
  }

  if (args.includes('-k')) {
    return _findPlanetsByCordinates(message, args);
  }

  if (args.includes('-s')) {
    return _findPlayersByAlliance(message, args);
  }

  const player = args.filter((v) => v.indexOf('-') !== 0).join('_');

  return _findPlanetsByPlayerName(message, player);
};

const _findPlanetsByPlayerName = (message: Message, player: string) => {
  const fullPlayersInfo = atlas.filter((v) => {
    if (v.hasOwnProperty('Gracz')) {
      let name = v?.['Gracz'];

      if (typeof name === 'string') {
        name = name.split(' ').join('_');

        return trim(toLower(name)) === trim(toLower(player));
      }

      return false;
    }
  });

  if (!fullPlayersInfo.length) {
    return message.channel.send(`Nie znaleziono gracza o nicku ${player}! Aby uzyskać pomoc wpisz !znajdz -h`);
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

    const playerEmbed = new MessageEmbed();

    playerEmbed.setTitle(`${nick}`);
    playerEmbed.setDescription(`${!!firstElm?.alliance ? `Sojusz ${firstElm.alliance}` : ''}`);

    const fields = data.map<EmbedFieldData>((v: DisplayPlayerInfo) => {
      return {
        name: v.planet,
        value: `${!!v.moon ? `Księżyc: ${v.moon}` : ''}\n
        [${v.gal}:${v.sys}:${v.pos}](https://mirkogame.pl/game.php?page=galaxy&galaxy=${v.gal}&system=${v.sys})
          [Skanuj 10 sondami](https://mirkogame.pl/game.php?page=fleetTable&galaxy=${v.gal}&system=${v.sys}&planet=${
          v.pos
        }&planettype=1&target_mission=6&ship[210]=10)
        `,
        inline: true,
      };
    });

    playerEmbed.addFields(fields);
    playerEmbed.setFooter(`Uwaga! Wpisy z atlasu nie działają w czasie rzeczywistym! Stan na 10.11.2020`);

    if (nick === 'dznwl') {
      playerEmbed.setImage(`https://media.giphy.com/media/13OYNXi0uTM6vS/giphy.gif`);
    }

    if (nick === 'WirujoncyHooy') {
      playerEmbed.setImage(`https://www.wykop.pl/cdn/c3201142/comment_15995607238c7XuG6Y2HL1f9cSjI4FD6.jpg`);
    }

    if (nick === 'mhrok') {
      playerEmbed.setImage(`https://cdn.discordapp.com/attachments/774794913559740436/779385553283317770/unknown.png`);
    }

    message.channel.send(playerEmbed);
  }
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
    (v) => String(v?.['G']) === position.gal && String(v?.['U']) === position.sys && String(v?.['P']) === position.pos
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
