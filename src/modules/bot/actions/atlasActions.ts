import { createCustomAction } from 'typesafe-actions';
import { AtlasElement } from '../../../utils/types/atlas';

export enum Keys {
  ADD_ATLAS_ELEMENT = '[ATLAS] Add atlas element',
  ADD_ATLAS_ELEMENTS = '[ATLAS] Add atlas elementS',
}

export const addAtlasElement = createCustomAction(Keys.ADD_ATLAS_ELEMENT, (element: AtlasElement) => ({value: element}))

export const addAtlasElements = createCustomAction(Keys.ADD_ATLAS_ELEMENTS, (elements: AtlasElement[]) => ({value: elements}))
