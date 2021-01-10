import { Document, Model } from 'mongoose';

export interface IFarm {
  coordinates: {
    gal: string;
    sys: string;
    pos: string;
  };
}

export interface IFarmDocument extends IFarm, Document {}

export interface IFarmModel extends Model<IFarmDocument> {
  findOneOrCreate: (this: IFarmModel, { gal, sys, pos }: { gal: string; sys: string; pos: string }) => Promise<IFarmDocument>;
}
