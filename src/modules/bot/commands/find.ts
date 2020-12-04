import { EmbedFieldData, MessageEmbed, Permissions } from 'discord.js';
import { Message } from 'discord.js';
import { find, toLower, trim, uniq } from 'lodash';
import { checkPermission } from '../../../utils/helpers';
import store from '../../../utils/store';
import { AtlasElement } from '../../../utils/types/atlas';

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
  const { atlas } = store.getState().atlasData;

  const playerPlanets = atlas.filter((v: AtlasElement) => {
    const name = v.player.replace(' ', '_');

    return trim(toLower(name)).includes(trim(toLower(player)));
  });

  if (!playerPlanets.length) {
    return message.channel.send(`Nie znaleziono gracza o nicku ${player.replace('_', ' ')}! Aby uzyskać pomoc wpisz !znajdz -h`);
  }

  if (playerPlanets.length > 12) {
    const foundPlayers = [...new Set(playerPlanets.map((v: AtlasElement) => v.player))];
    return message.channel.send(`Znalazłem za dużo wyników! Znalezieni gracze to: ${foundPlayers.join(', ')}.`);
  }

  const multiplePlayersInfo: { [player: string]: AtlasElement[] } = {};

  playerPlanets.forEach((v) => {
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
    playerEmbed.setDescription(`${!!firstElm?.alliance ? `Sojusz ${firstElm.alliance}` : ''} [Karta gracza](${firstElm.links.playerLink})`);
    console.log('data: ', data);
    const fields = data.map<EmbedFieldData>((v: AtlasElement) => {
      const {
        planet,
        moon,
        position: { gal, sys, pos },
        links: { planetLink, spyLink, moonSpyLink },
      } = v;

      return {
        name: planet,
        value: `${!!moon ? `Księżyc: ${moon}\n[Szpieguj księżyc](${moonSpyLink})` : ''}\n
        [${gal}:${sys}:${pos}](${planetLink})
        [Szpieguj](${spyLink})`,
        inline: true,
      };
    });

    playerEmbed.addFields(fields);
    playerEmbed.setFooter(`Uwaga! Wpisy z atlasu nie działają w czasie rzeczywistym! Stan na 04.12.2020`);

    if (nick === 'Mhrok') {
      playerEmbed.setImage(`https://cdn.discordapp.com/attachments/774794913559740436/779385553283317770/unknown.png`);
    }

    message.channel.send(playerEmbed);
  }
};

const _findPlanetsByCordinates = (message: Message, args: string[]) => {
  const { atlas } = store.getState().atlasData;
  let coordinates = args.find((v) => v.match(/\[*[1-4]:[0-9]{1,3}:[0-9]{1,2}\]*/));

  if (!coordinates) {
    return message.channel.send('Koordynaty wpisane niepoprawnie! Przykłady => 1:2:3, [4:200:3]');
  }

  coordinates = coordinates.replace('[', '');
  coordinates = coordinates.replace(']', '');

  const splittedCoordinates = coordinates.split(':');

  const position = {
    gal: Number(splittedCoordinates[0]),
    sys: Number(splittedCoordinates[1]),
    pos: Number(splittedCoordinates[2]),
  };

  const foundPlanet = atlas.find((v: AtlasElement) => {
    const { gal, sys, pos } = v.position;

    return gal === position.gal && sys === position.sys && pos === position.pos;
  });

  if (!foundPlanet) {
    return message.channel.send('Nie znaleziono planety na podanych koordynatach!');
  }

  return _findPlanetsByPlayerName(message, foundPlanet.player.replace(' ', '_'));
};

const _findPlayersByAlliance = (message: Message, args: string[]) => {
  const { atlas } = store.getState().atlasData;
  const alliance = args[0];

  const alliedPlayers = atlas
    .filter((v: AtlasElement) => {
      return trim(toLower(v.alliance)) === trim(toLower(alliance));
    })
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
