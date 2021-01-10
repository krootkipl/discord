import { IFarm } from '../farms/farmsTypes';
import { IUserDocument, IUserModel } from './usersTypes';

export async function findOneOrCreate(
  this: IUserModel,
  { username, discordId, farms }: { username: string; discordId: string; farms?: string[] }
): Promise<IUserDocument> {
  const record = await this.findOne({ discordId });
  const _farms: string[] = farms ?? [];

  if (record) {
    return record;
  } else {
    return this.create({
      username,
      discordId,
      farms: _farms,
    });
  }
}

export async function addFarmForUser(
  this: IUserModel,
  { discordId, farmId }: { discordId: string; farmId: string }
): Promise<IUserDocument> {
  const record = await this.findOne({ discordId });

  await record.farms.push(farmId);
  await record.save();

  return record;
}
