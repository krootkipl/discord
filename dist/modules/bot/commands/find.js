"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommand = void 0;
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
    console.log('fullPlayersInfo: ', fullPlayersInfo);
    console.log('fullPlayersInfo.length: ', fullPlayersInfo.length);
    if (!fullPlayersInfo.length) {
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
    console.log('displayPlayerInfo: ', displayPlayerInfo);
    message.channel.send(`Gracz: ${player} ${!!((_a = displayPlayerInfo === null || displayPlayerInfo === void 0 ? void 0 : displayPlayerInfo[0]) === null || _a === void 0 ? void 0 : _a.alliance) ? `należący do sojuszu ${displayPlayerInfo[0].alliance}` : ''} - znalezione planety:`);
    return message.channel
        .send(displayPlayerInfo.map((v) => {
        return `${v.gal}:${v.system}:${v.pos} - ${v.planet} - https://mirkogame.pl/game.php?page=galaxy&galaxy=${v.gal}&system=${v.system}`;
    }))
        .then((v) => v.suppressEmbeds(true));
};
//# sourceMappingURL=find.js.map