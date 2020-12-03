import { AtlasElement } from './atlas';

export type AtlasDataState = {
  atlas: AtlasElement[];
};

export type RootState = {
  atlasData: AtlasDataState;
};
