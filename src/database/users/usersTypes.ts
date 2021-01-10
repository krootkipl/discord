import { Document, Model } from 'mongoose';
import { IFarm } from '../farms/farmsTypes';

export interface IUser {
  username: string;
  discordId: string;
  farms: string[];
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {
  findOneOrCreate: (
    this: IUserModel,
    { username, discordId, farms }: { username: string; discordId: string; farms?: string[] }
  ) => Promise<IUserDocument>;
  addFarmForUser: (this: IUserModel, { discordId, farmId }: { discordId: string; farmId: string }) => Promise<IUserDocument>;
}
