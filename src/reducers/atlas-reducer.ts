import update from 'immutability-helper';
import { ActionType } from 'typesafe-actions';
import { AtlasDataState } from '../utils/types/state';
import * as AtlasActions from '../modules/bot/actions/atlasActions';
import { stat } from 'fs';

const INIT_STATE: AtlasDataState = {
  atlas: [],
};

export default function (state: AtlasDataState = INIT_STATE, action: ActionType<typeof AtlasActions>) {
  switch (action.type) {
    case AtlasActions.Keys.ADD_ATLAS_ELEMENT:
      return update(state, { atlas: { $push: [action.value] } });

    case AtlasActions.Keys.ADD_ATLAS_ELEMENTS:
      return update(state, { atlas: { $push: action.value } });

    default:
      return state;
  }
}
