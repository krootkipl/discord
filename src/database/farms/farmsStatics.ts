import { IFarmDocument, IFarmModel } from './farmsTypes';

export async function findOneOrCreate(
  this: IFarmModel,
  { gal, sys, pos }: { gal: string; sys: string; pos: string }
): Promise<IFarmDocument> {
  const coordinates = {
    gal,
    sys,
    pos,
  };

  const record = await this.findOne({ coordinates });

  if (record) {
    return record;
  } else {
    return this.create({
      coordinates,
    });
  }
}
