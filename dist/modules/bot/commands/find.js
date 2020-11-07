"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommand = void 0;
const discord_js_1 = require("discord.js");
const lodash_1 = require("lodash");
const helpers_1 = require("../../../utils/helpers");
const atlas = require('../../../../resources/atlas.json');
exports.findCommand = (message, args) => {
    if (!helpers_1.checkPermission(message.member, discord_js_1.Permissions.FLAGS.MANAGE_ROLES)) {
        return message.channel.send(`Nie masz uprawnień do zarządzania rolami!`);
    }
    if (!args.length) {
        return message.channel.send(`Nieprawidłowa komenda! Wpisz !znajdz <nick_gracza>`);
    }
    if (args[0].length < 3) {
        return message.channel.send(`Wpisz przynajmniej 3 znaki nicku gracza!`);
    }
    const player = args[0];
    const fullPlayersInfo = atlas.filter((v) => {
        if (v.hasOwnProperty('Gracz (Status)')) {
            const name = v === null || v === void 0 ? void 0 : v['Gracz (Status)'];
            if (typeof name === 'string') {
                return lodash_1.trim(lodash_1.toLower(name)).includes(lodash_1.trim(lodash_1.toLower(player)));
            }
            return false;
        }
    });
    if (!fullPlayersInfo.length) {
        return message.channel.send(`Nie znaleziono gracza o nicku ${player}`);
    }
    const displayPlayerInfo = fullPlayersInfo.map((v) => {
        var _a, _b;
        let planetName = v['Planeta / Nazwa (Aktywność)'];
        planetName = planetName.replace((_b = (_a = planetName.match(/\((.*?)\)/g)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '', '');
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
    const multiplePlayersInfo = {};
    displayPlayerInfo.forEach((v) => {
        if (!multiplePlayersInfo[v.player]) {
            multiplePlayersInfo[v.player] = [v];
        }
        else {
            multiplePlayersInfo[v.player].push(v);
        }
    });
    Object.entries(multiplePlayersInfo).forEach((v) => {
        var _a;
        message.channel.send(`Gracz ${v[0]}${!!((_a = v[1][0]) === null || _a === void 0 ? void 0 : _a.alliance) ? ` należący do sojuszu ${v[1][0].alliance}` : ''} - znalezione planety (ładowanie może trwać parę sekund):`);
        v[1]
            .map((x) => {
            return new discord_js_1.MessageEmbed({
                title: `${x.gal}:${x.system}:${x.pos} - ${x.planet}`,
                url: `https://mirkogame.pl/game.php?page=galaxy&galaxy=${x.gal}&system=${x.system})`,
                description: `${!!x.moon ? `Przy planecie znajduje się księżyc: ${x.moon}` : ''}`,
            });
        })
            .forEach((x) => message.channel.send(x));
    });
    return message.channel.send('Uwaga! Wpisy z atlasu nie działają w czasie rzeczywistym!');
};
//# sourceMappingURL=find.js.map