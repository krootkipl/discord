import store from '../store';
import { AtlasElement } from '../types/atlas';
import * as AtlasActions from '../../modules/bot/actions/atlasActions';

const atlas: Object[] = require('../../../resources/atlas.json');

const cutValueFromHyperlink = (link: string) => {
  let value = link.substring(link.indexOf(';') + 1, link.length - 1).trim();

  return value.substr(1, value.length - 2);
};

const cutActivityFromPlanetName = (name: string) => {
  if (name.indexOf('(') > -1) {
    return name.substring(0, name.indexOf('(') - 1);
  }

  return name;
};

const cutHyperlink = (link: string) => link.substring(link.indexOf('(') + 3, link.indexOf(';') - 1);

export const initAtlas = () => {
  const filteredAtlas = atlas.filter((v) => !!String(v['Gracz (Status)']).length);

  const remappedAtlasValues: AtlasElement[] = filteredAtlas.map<AtlasElement>((v) => {
    return {
      position: {
        gal: Number(v['System']),
        sys: Number(v['Galaktyka']),
        pos: Number(cutValueFromHyperlink(String(v['Pos']))),
      },
      player: cutValueFromHyperlink(String(v['Gracz (Status)'])),
      status: v['Status'],
      planet: cutActivityFromPlanetName(String(v['Nazwa (Aktywność)'])),
      alliance: v['Sojusz'] !== '-' ? v['Sojusz'] : '',
      rank: v['Ranking'],
      moon: v['Księżyc'],
      links: {
        planetLink: cutHyperlink(String(v['Pos'])),
        spyLink: cutHyperlink(String(v['Akcja'])),
        playerLink: cutHyperlink(String(v['Gracz (Status)'])),
      },
    };
  });

  store.dispatch(AtlasActions.addAtlasElements(remappedAtlasValues));
};
