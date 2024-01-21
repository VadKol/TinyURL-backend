import Express from 'express';
import getHashedUrl from './getHashedUrl';
import postHashedUrl from './postHashedUrl';
import type { Router } from 'express';

const router: Router = Express.Router();

router.get('/tinyurl/:hashed', getHashedUrl);
router.post('/tinyurl', postHashedUrl);

export default router;
