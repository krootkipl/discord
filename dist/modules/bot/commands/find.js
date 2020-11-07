"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommand = void 0;
const atlas = require('../../../../resources/atlas.json');
exports.findCommand = (message, args) => {
    if (!args.length) {
        return message.channel.send(`Nieprawidłowa komenda! Wpisz !znajdz <nick_gracza>`);
    }
    const player = args[0];
    console.log('player: ', player);
    const fullPlayersIno = atlas.filter((v) => {
        if (v.hasOwnProperty('Gracz (Status)')) {
            const name = v === null || v === void 0 ? void 0 : v['Gracz (Status)'];
            if (typeof name === 'string') {
                return name.includes(player);
            }
            return false;
        }
    });
    const displayPlayerInfo = fullPlayersIno.map((v) => {
        return {
            system: v['Gal'],
            gal: v['System'],
            pos: v['Pos'],
            planet: v['Planeta / Nazwa (Aktywność)'],
            alliance: v['Sojusz'],
            rank: v['Pozycja'],
        };
    });
    message.channel.send(`Gracz: ${player} ${!!displayPlayerInfo[0].alliance.length ? `należący do sojuszu ${displayPlayerInfo[0].alliance}` : ''} - znalezione planety:`);
    return message.channel
        .send(displayPlayerInfo.map((v) => {
        return `${v.gal}:${v.system}:${v.pos} - ${v.planet} - https://mirkogame.pl/game.php?page=galaxy&galaxy=${v.gal}&system=${v.system}`;
    }))
        .then((v) => v.suppressEmbeds(true));
};
//# sourceMappingURL=find.js.map