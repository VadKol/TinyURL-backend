import { getOriginalUrl } from '../../services/hashService';
import Logger from '../../utils/logger';
import type { Request, Response, NextFunction } from 'express';

export default async function getHashedUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const hashedValue: string = req.params.hashed;
    const response = await getOriginalUrl(hashedValue);
    res.status(302).redirect(response?.originalURL ?? '');
  } catch (err: any) {
    Logger.error('getHashedUrl', err.stack);
    next(err);
  }
}
