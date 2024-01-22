import express, { Router } from 'express';
import {
  createShortUrl,
  deleteShortUrl,
  getAllUrls,
  getShortenUrl,
  inputLongUrl,
  redirectToLongUrl,
} from '../controllers/UrlControllers';
import healthCheck from '../middlewares/healthCheck';

const router: Router = express.Router();

router.get('/', getAllUrls);
router.get('/:urlCode', getShortenUrl);
router.get('/redirect/:urlCode', redirectToLongUrl);
router.post('/create', createShortUrl);
router.post('/longUrl', inputLongUrl);
router.delete('/:urlCode', deleteShortUrl);

router.get('/healthcheck', healthCheck);

export default router;
