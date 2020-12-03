import { createCustomAction } from 'typesafe-actions';
import { AtlasElement } from '../../../utils/types/atlas';

export enum Keys {
  ADD_ATLAS_ELEMENT = '[ATLAS] Add atlas element',
}

export const addAtlasElement = createCustomAction(Keys.ADD_ATLAS_ELEMENT, (element: AtlasElement) => ({value: element}))