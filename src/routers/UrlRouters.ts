import express, { Router } from 'express';
import {
  createShortUrl,
  deleteShortUrl,
  getAllUrls,
  getShortenUrl,
  inputLongUrl,
} from '../controllers/UrlController';
import healthCheck from '../middleware/healthCheck';

const router: Router = express.Router();

router.get('/', getAllUrls);
router.get('/:urlCode', getShortenUrl);
router.post('/create', createShortUrl);
router.post('/long-url', inputLongUrl);
router.delete('/:urlCode', deleteShortUrl);

router.get('/healthcheck', healthCheck);

export default router;
