import { Action, combineReducers, configureStore, createStore } from '@reduxjs/toolkit';
import atlasReducer from '../reducers/atlas-reducer';
import { RootState } from './types/state';

const reducers = combineReducers<RootState>({
  atlasData: atlasReducer,
});

module.exports = configureStore({
  reducer: reducers,
  devTools: false,
});
