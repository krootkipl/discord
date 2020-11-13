"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommand = void 0;
const discord_js_1 = require("discord.js");
const lodash_1 = require("lodash");
const atlas = require('../../../../resources/atlas.json');
exports.findCommand = (message, args) => {
    if (!args.length) {
        return message.channel.send(`Nieprawidłowa komenda! Wpisz !znajdz <nick_gracza>\n-k > parametr do szukania po koordynatach (np. !znajdz [4:171:6] -k)\n-k > parametr do szukania graczy po nazwie sojuszu (np. !znajdz co5g -s) - ważne! należy wpisać nazwę taką jak w widoku galaktyki!`);
    }
    if (args.includes('-k')) {
        return _findPlanetsByCordinates(message, args);
    }
    if (args.includes('-s')) {
        return _findPlayersByAlliance(message, args);
    }
    return _findPlanetsByPlayerName(message, args[0]);
};
const _findPlanetsByPlayerName = (message, player) => {
    if (player.length < 3) {
        return message.channel.send(`Wpisz przynajmniej 3 znaki nicku gracza!`);
    }
    const fullPlayersInfo = atlas.filter((v) => {
        if (v.hasOwnProperty('Gracz')) {
            const name = v === null || v === void 0 ? void 0 : v['Gracz'];
            return typeof name === 'string' ? lodash_1.trim(lodash_1.toLower(name)).includes(lodash_1.trim(lodash_1.toLower(player))) : false;
        }
    });
    if (!fullPlayersInfo.length) {
        return message.channel.send(`Nie znaleziono gracza o nicku ${player}`);
    }
    const displayPlayerInfo = fullPlayersInfo.map((v) => {
        return {
            gal: v['G'],
            sys: v['U'],
            pos: v['P'],
            player: v['Gracz'],
            status: v['Status'],
            planet: v['Nazwa'],
            alliance: v !== '-' ? v['Sojusz'] : '',
            rank: v['Ranking'],
            moon: v['Moon'],
        };
    });
    if (displayPlayerInfo.length > 20) {
        return message.channel.send(`Wpisz dokładniejszy nick, znalazłem ponad 20 wyników! Nie chcemy zaśmiecać chatu, prawda? :D`);
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
        message.channel.send(`Gracz ${nick}${statusInfo ? ` (${statusInfo})` : ''}${!!(firstElm === null || firstElm === void 0 ? void 0 : firstElm.alliance) ? ` należący do sojuszu ${firstElm.alliance}` : ''} - znalezione planety (ładowanie może trwać parę sekund):`);
        data
            .map((x) => new discord_js_1.MessageEmbed({
            title: `${x.gal}:${x.sys}:${x.pos} - ${x.planet}`,
            url: `https://mirkogame.pl/game.php?page=galaxy&galaxy=${x.gal}&system=${x.sys})`,
            description: `${!!x.moon ? `Przy planecie znajduje się księżyc: ${x.moon}` : ''}`,
        }))
            .forEach((x) => message.channel.send(x));
    }
    return message.channel.send('Uwaga! Wpisy z atlasu nie działają w czasie rzeczywistym! Stan na 06.11.2020');
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
    const foundPlanet = atlas.find((v) => String(v === null || v === void 0 ? void 0 : v['']) === position.gal && String(v === null || v === void 0 ? void 0 : v['U']) === position.sys && String(v === null || v === void 0 ? void 0 : v['P']) === position.pos);
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