"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommand = void 0;
const discord_js_1 = require("discord.js");
const lodash_1 = require("lodash");
const atlas = require('../../../../resources/atlas.json');
exports.findCommand = (message, args) => {
    if (!args.length) {
        return message.channel.send(`Nieprawidłowa komenda! Wpisz !znajdz <nick_gracza>\n
      -k > parametr do szukania po koordynatach (np. !znajdz [4:171:6] -k)\n
      -s > parametr do szukania graczy po nazwie sojuszu (np. !znajdz co5g -s) - ważne! należy wpisać nazwę taką jak w widoku galaktyki!`);
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
const _findPlanetsByPlayerName = (message, player) => {
    const fullPlayersInfo = atlas.filter((v) => {
        if (v.hasOwnProperty('Gracz')) {
            let name = v === null || v === void 0 ? void 0 : v['Gracz'];
            if (typeof name === 'string') {
                name = name.split(' ').join('_');
                return lodash_1.trim(lodash_1.toLower(name)) === lodash_1.trim(lodash_1.toLower(player));
            }
            return false;
        }
    });
    if (!fullPlayersInfo.length) {
        return message.channel.send(`Nie znaleziono gracza o nicku ${player}! Aby uzyskać pomoc wpisz !znajdz -h`);
    }
    let displayPlayerInfo = fullPlayersInfo.map((v) => {
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
        if (!displayPlayerInfo.some((v) => v.player === player)) {
            return message.channel.send(`Wpisz dokładniejszy nick, znalazłem ponad 20 wyników! Nie chcemy zaśmiecać chatu, prawda? :D`);
        }
        else {
            displayPlayerInfo = displayPlayerInfo.filter((v) => v.player === player);
            message.channel.send(`Znalazłem ponad 20 wyników! Wyświetlę tylko te najtrafniejsze, wpisz dokładniejszy nick!`);
        }
    }
    const multiplePlayersInfo = {};
    displayPlayerInfo.forEach((v) => {
        if (!multiplePlayersInfo[v.player]) {
            multiplePlayersInfo[v.player] = [v];
        }
        else {
            multiplePlayersInfo[v.player].push(v);
        }
    });
    for (let [nick, data] of Object.entries(multiplePlayersInfo)) {
        const firstElm = data[0];
        const statusInfo = statusSelector(firstElm.status);
        const playerEmbed = new discord_js_1.MessageEmbed();
        playerEmbed.setTitle(`${nick}`);
        playerEmbed.setDescription(`${!!(firstElm === null || firstElm === void 0 ? void 0 : firstElm.alliance) ? `Sojusz ${firstElm.alliance}` : ''}`);
        const fields = data.map((v) => {
            return {
                name: v.planet,
                value: `[${v.gal}:${v.sys}:${v.pos}](https://mirkogame.pl/game.php?page=galaxy&galaxy=${v.gal}&system=${v.sys})\
          [Skanuj 10 sondami](https://mirkogame.pl/game.php?page=fleetTable&galaxy=${v.gal}&system=${v.sys}&planet=${v.planet}&planettype=1&target_mission=1&ship[210]=10)
        `,
                inline: true,
            };
        });
        playerEmbed.addFields(fields);
        playerEmbed.setFooter(`Uwaga! Wpisy z atlasu nie działają w czasie rzeczywistym! Stan na 10.11.2020`);
        if (nick === 'dznwl') {
            playerEmbed.setImage(`https://media.giphy.com/media/13OYNXi0uTM6vS/giphy.gif`);
        }
        message.channel.send(playerEmbed);
    }
};
const _findPlanetsByCordinates = (message, args) => {
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
    const foundPlanet = atlas.find((v) => String(v === null || v === void 0 ? void 0 : v['G']) === position.gal && String(v === null || v === void 0 ? void 0 : v['U']) === position.sys && String(v === null || v === void 0 ? void 0 : v['P']) === position.pos);
    if (!foundPlanet || !(foundPlanet === null || foundPlanet === void 0 ? void 0 : foundPlanet['Gracz'].length)) {
        return message.channel.send('Nie znaleziono planety na podanych koordynatach!');
    }
    return _findPlanetsByPlayerName(message, foundPlanet['Gracz']);
};
const _findPlayersByAlliance = (message, args) => {
    const alliance = args[0];
    const alliedPlayers = lodash_1.uniq(atlas
        .filter((v) => {
        if (!v.hasOwnProperty('Sojusz')) {
            return false;
        }
        const _alliance = v['Sojusz'];
        return lodash_1.trim(lodash_1.toLower(_alliance)).includes(lodash_1.trim(lodash_1.toLower(alliance)));
    })
        .map((v) => v['Gracz']))
        .sort()
        .join(', ');
    if (!alliedPlayers.length) {
        return message.channel.send('Nie znalezionio takiego sojuszu!');
    }
    return message.channel.send(alliedPlayers);
};
const statusSelector = (status) => {
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
//# sourceMappingURL=find.js.map