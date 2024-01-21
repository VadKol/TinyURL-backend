import TinyUrl from '../models/urls';
import { promises as dns } from 'dns';
import type { IUrl } from '../models/urls';
import Logger from '../utils/logger';

export type tinyUrl = {
  hashedValues?: string;
  originalURL?: string,
  creationDate?: Date,
  expirationDate?: Date
  baseRoute?: string
} | null;

export async function createTinyUrl(hashedValues: string, originalURL: string): Promise<boolean> {
  try {
    await dns.resolve4(originalURL.split('/')[2])
    const tinyurl: IUrl = new TinyUrl({
      hashedValues,
      originalURL,
      creationDate: new Date(),
      expirationDate: new Date((new Date()).getTime() + (1 * 24 * 60 * 60 * 1000))
    });
    const response = await tinyurl.save();
    return !!response;
  } catch (err) {
    Logger.error(`Invalid domain for ${originalURL.split('/')[2]}`);
    throw new Error(`Invalid domain for ${originalURL.split('/')[2]}`);
  }
}

export async function findTinyUrl(hashedValues: string): Promise<tinyUrl> {
  const tinyUrl: Array<IUrl> = await TinyUrl.find({ hashedValues });
  const response = tinyUrl.length !== 0 ? tinyUrl[0] : null;
  return response;
}

export async function removeTinyUrl(hashedValues: string): Promise<boolean> {
  const result = await TinyUrl.deleteMany({ hashedValues });
  return result.deletedCount !== undefined && result.deletedCount > 0;
}
