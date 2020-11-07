"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommand = void 0;
const discord_js_1 = require("discord.js");
const lodash_1 = require("lodash");
const atlas = require('../../../../resources/atlas.json');
exports.findCommand = (message, args) => {
    var _a;
    if (!args.length) {
        return message.channel.send(`Nieprawidłowa komenda! Wpisz !znajdz <nick_gracza>`);
    }
    const player = args[0];
    const fullPlayersInfo = atlas.filter((v) => {
        if (v.hasOwnProperty('Gracz (Status)')) {
            const name = v === null || v === void 0 ? void 0 : v['Gracz (Status)'];
            if (typeof name === 'string') {
                return lodash_1.trim(lodash_1.toLower(name)) === lodash_1.trim(lodash_1.toLower(player));
            }
            return false;
        }
    });
    if (!fullPlayersInfo.length) {
        return message.channel.send(`Nie znaleziono gracza o nicku ${player}`);
    }
    const displayPlayerInfo = fullPlayersInfo.map((v) => {
        let planetName = v['Planeta / Nazwa (Aktywność)'];
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
    message.channel.send(`Gracz: ${player} ${!!((_a = displayPlayerInfo === null || displayPlayerInfo === void 0 ? void 0 : displayPlayerInfo[0]) === null || _a === void 0 ? void 0 : _a.alliance) ? `należący do sojuszu ${displayPlayerInfo[0].alliance}` : ''} - znalezione planety (ładowanie może trwać parę sekund):`);
    // const links = displayPlayerInfo.map((v) => `[${v.gal}:${v.system}:${v.pos} - ${v.planet}](https://mirkogame.pl/game.php?page=galaxy&galaxy=${v.gal}&system=${v.system})`)
    displayPlayerInfo
        .map((v) => {
        return new discord_js_1.MessageEmbed({
            title: `${v.gal}:${v.system}:${v.pos} - ${v.planet}`,
            url: `https://mirkogame.pl/game.php?page=galaxy&galaxy=${v.gal}&system=${v.system})`,
            description: `${!!v.moon ? `Przy planecie znajduje się księżyc: ${v.moon}` : ''}`,
        });
    })
        .forEach((v) => message.channel.send(v));
    return message.channel.send('Uwaga! Wpisy z atlasu nie działają w czasie rzeczywistym!');
};
//# sourceMappingURL=find.js.map