import { Schema } from 'mongoose';
import FarmsSchema from '../farms/farmsSchema';
import { findOneOrCreate, addFarmForUser } from './usersStatics';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  discordId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  lastUpdated: {
    type: Date,
    default: new Date(),
  },
  farms: {
    type: [String],
  },
});

UserSchema.statics.findOneOrCreate = findOneOrCreate;
UserSchema.statics.addFarmForUser = addFarmForUser;

export default UserSchema;
