import type { tinyUrl } from './urlService';
import { createTinyUrl, findTinyUrl } from './urlService';
import { getCachedUrl, cacheUrl } from '../services/cacheService';
import Logger from '../utils/logger';

const loadNanoIdModule = async () => {
  const nanoidModule = await import('nanoid');
  return nanoidModule;
};

async function getUniqNanoId(url: string, baseRoute: string, customText?: string, size?: number): Promise<string> {
  const nanoidModule = await loadNanoIdModule();

  let hashedValue;
  do {
    if (customText) {
      const customizedNanoid = nanoidModule.customAlphabet(customText, size ?? 10);
      hashedValue = await customizedNanoid();
    } else {
      hashedValue = await nanoidModule.nanoid();
    }

    const tinyUrlInfo: tinyUrl = await findTinyUrl(hashedValue);
    if (!tinyUrlInfo) break;
  } while (true);

  return hashedValue;
}

export async function getOriginalUrl(hashedValue: string): Promise<tinyUrl> {
  const response: tinyUrl = {};
  const rawCachedUrl: string | undefined = await getCachedUrl(hashedValue);

  if (rawCachedUrl) {
    const cachedUrl: tinyUrl = JSON.parse(rawCachedUrl);
    Object.assign(response, cachedUrl);
  } else {
    const info: tinyUrl = await findTinyUrl(hashedValue);
    Object.assign(response, info);
  }

  return response ?? {};
}

export async function saveHashedUrl(url: string, baseRoute: string, customText?: string, size?: number): Promise<tinyUrl> {
  const hashedValue: string = await getUniqNanoId(url, baseRoute, customText, size);
  const isUrlCreated: boolean = await createTinyUrl(hashedValue, url);
  const tinyUrlInfo: tinyUrl = isUrlCreated ? await findTinyUrl(hashedValue) : {};
  const isCachedSuccessfully: boolean = await cacheUrl(hashedValue, tinyUrlInfo);

  if (!isCachedSuccessfully) {
    Logger.warning(`Redis did not cache key ${hashedValue} at ${new Date()}`);
  }

  return {
    hashedValues: tinyUrlInfo?.hashedValues,
    originalURL: tinyUrlInfo?.originalURL,
    creationDate: tinyUrlInfo?.creationDate,
    expirationDate: tinyUrlInfo?.expirationDate,
    baseRoute: `${baseRoute}/${tinyUrlInfo?.hashedValues}`
  };
}
