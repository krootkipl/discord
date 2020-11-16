"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kalkCommand = void 0;
const kalkList = [
    {
        name: 'SpeedSim - symulator walki',
        url: 'https://websim.speedsim.net/index.php?lang=pl',
    },
    {
        name: 'Kalkulator czasu lotu',
        url: 'http://www.toolsforogame.com/costes/tiempo_vuelo.aspx?idi=en-us',
    },
    {
        name: 'Kalkulator kosztów budowy',
        url: 'https://proxyforgame.com/pl/ogame/calc/costs.php',
    },
    {
        name: 'Kalkulator ekspedycji',
        url: 'http://bontchev.my.contact.bg/ogame/expeditions.html',
    },
    {
        name: 'Kalkulator ataków rakietowych',
        url: 'http://www.toolsforogame.com/misiles/misiles.aspx?idi=en-us',
    },
    {
        name: 'Kalkulator prób moonowych',
        url: 'https://proxyforgame.com/pl/ogame/calc/moon.php'
    }
];
exports.kalkCommand = (message) => {
    return message.channel
        .send(kalkList.map((v) => `${v.name}: \n${v.url}\n----------------------------------`))
        .then((v) => v.suppressEmbeds(true));
};
//# sourceMappingURL=kalkulator.js.map