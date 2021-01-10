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
  const filteredAtlas = atlas.filter((v) => !!String(v['Player (State)']).length);

  const remappedAtlasValues: AtlasElement[] = filteredAtlas.map<AtlasElement>((v) => {
    let moonValue = String(v['Moon']);

    if (moonValue.includes('HYPERLINK')) {
      moonValue = cutValueFromHyperlink(moonValue);
    }

    return {
      position: {
        gal: Number(v['System']),
        sys: Number(v['Galaktyka']),
        pos: Number(cutValueFromHyperlink(String(v['Pos.']))),
      },
      player: String(v['Player (State)']),
      status: String(v['Status']),
      planet: cutValueFromHyperlink(String(v['Name (Activity)'])),
      alliance: v['Alliance'] !== '-' ? String(v['Alliance']) : '',
      rank: String(v['Pozycja']),
      moon: moonValue,
      links: {
        planetLink: cutHyperlink(String(v['Pos.'])),
        spyLink: cutHyperlink(String(v['Name (Activity)'])),
        moonSpyLink: String(v['Moon']),
        playerLink: String(v['Player (State)']),
      },
    };
  });

  store.dispatch(AtlasActions.addAtlasElements(remappedAtlasValues));
};
