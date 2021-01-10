import { Schema } from 'mongoose';
import { findOneOrCreate } from './farmsStatics';

const FarmsSchema = new Schema({
  coordinates: {
    gal: {
      type: String,
      required: true,
    },
    sys: {
      type: String,
      required: true,
    },
    pos: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  lastUpdated: {
    type: Date,
    default: new Date(),
  },
});

FarmsSchema.statics.findOneOrCreate = findOneOrCreate;

export default FarmsSchema;
