import { model } from 'mongoose';
import FarmsSchema from './farmsSchema';
import { IFarmDocument, IFarmModel } from './farmsTypes';

export const FarmModel = model<IFarmDocument>('farm', FarmsSchema) as IFarmModel;
