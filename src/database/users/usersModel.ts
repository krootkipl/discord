import { model } from 'mongoose';
import UserSchema from './usersSchema';
import { IUserDocument, IUserModel } from './usersTypes';

export const UserModel = model<IUserDocument>('user', UserSchema) as IUserModel;
