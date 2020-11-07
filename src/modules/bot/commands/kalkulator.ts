import { Message } from 'discord.js';

const kalkList: { name: string; url: string }[] = [
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
];

export const kalkCommand = (message: Message) => {
  return message.channel
    .send(kalkList.map((v) => `${v.name}: \n${v.url}\n----------------------------------`))
    .then((v) => v.suppressEmbeds(true));
};
