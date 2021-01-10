import { Message } from 'discord.js';

import { db } from '../../..';
import { IFarm, IFarmDocument } from '../../../database/farms/farmsTypes';
import { ROLE_FARMER_ID } from '../../../utils/consts';
import { checkIfHasRoleByID } from '../../../utils/helpers';
import { getCoordinatesFromArgs } from '../../../utils/helpers/coordinates';
import store from '../../../utils/store';
import { AtlasElement } from '../../../utils/types/atlas';

export const farmCommand = async (message: Message, args: string[]) => {
  if (!checkIfHasRoleByID(message.member, ROLE_FARMER_ID)) {
    return message.channel.send(`Nie masz uprawnień do tej komendy!`);
  }

  if (!args.length) {
    return message.channel.send(`Nieprawidłowa komenda! Wpisz !farma`);
  }

  if (args.includes('dodaj')) {
    const _args = args;
    _args.splice(_args.indexOf('dodaj'), 1);

    return farmAdd(message, _args);
  }

  if (args.includes('pokaz')) {
    const _args = args;
    _args.splice(_args.indexOf('pokaz'), 1);

    return farmsShow(message);
  }
};

const farmAdd = async (message: Message, args: string[]) => {
  const { atlas } = store.getState().atlasData;
  const position = getCoordinatesFromArgs(args);

  if (!position) {
    return message.channel.send(`Nieprawidłowe koordynaty farmy!`);
  }

  const _gal = String(position.gal);
  const _sys = String(position.sys);
  const _pos = String(position.pos);

  const planet = atlas.find((v: AtlasElement) => {
    const { gal, sys, pos } = v.position;

    return gal === position.gal && sys === position.sys && pos === position.pos;
  });

  if (!planet) {
    return message.channel.send(`Nie znaleziono planety na podanych koordynatach`);
  }

  const userRecord = await db.UserModel.findOneOrCreate({ username: message.author.username, discordId: message.author.id });
  const { farms } = userRecord;

  const farmRecord = await db.FarmModel.findOneOrCreate({ gal: _gal, sys: _sys, pos: _pos });
  const { id } = farmRecord;

  if (!farms.includes(id)) {
    await db.UserModel.addFarmForUser({ discordId: message.author.id, farmId: id }).then(() => {
      return message.channel.send('Dodano farmę!');
    });
  }
};

const farmsShow = async (message: Message) => {
  const { atlas } = store.getState().atlasData;

  const userRecord = await db.UserModel.findOneOrCreate({ username: message.author.username, discordId: message.author.id });

  const { farms } = userRecord;

  if (!farms.length) {
    return message.channel.send(`Lista farm jest pusta!`);
  }

  const farmsCoordinates = await db.FarmModel.find({ _id: { $in: farms } });

  const planets = atlas.filter((v: AtlasElement) => {
    const _gal = String(v.position.gal);
    const _sys = String(v.position.sys);
    const _pos = String(v.position.pos);

    return farmsCoordinates.some((v: IFarmDocument) => {
      const { gal, sys, pos } = v.coordinates;

      return gal === _gal && sys === _sys && pos === _pos;
    });
  });

  return message.channel.send(`${planets.map((v: AtlasElement) => `${v.planet}: ${v.position.gal}:${v.position.sys}:${v.position.pos}`)}`);
};
