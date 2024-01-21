import config from 'config';
import { Request, Response } from 'express';
import validUrl from 'valid-url';
import Url from '../models/UrlModel';
import { isUrlCodeExists } from '../utils/isUrlCodeExists';

export const getAllUrls = async (req: Request, res: Response) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get superheroes' });
  }
};

export const getShortenUrl = async (req: Request, res: Response) => {
  try {
    const urlObject = await Url.findOne({ urlCode: req.params.urlCode });

    if (urlObject) {
      return res.redirect(urlObject.longUrl);
    } else {
      return res.status(404).json('No url found!');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
};

export const createShortUrl = async (req: Request, res: Response) => {
  const { longUrl } = req.body;
  const baseUrl = config.get('baseUrl');

  if (!validUrl.isUri(baseUrl as string)) {
    return res.status(401).json('invalid base url!');
  }

  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) {
        res.json(url);
      } else {
        const urlCode = await isUrlCodeExists();
        const shortUrl = baseUrl + '/' + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
};

export const inputLongUrl = async (req: Request, res: Response) => {
  const { shortUrl } = req.body;

  if (validUrl.isUri(shortUrl)) {
    try {
      const url = await Url.findOne({ shortUrl });

      if (url) {
        res.json(url);
      } else {
        res.status(404).json('No url found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid short url');
  }
};

export const deleteShortUrl = async (req: Request, res: Response) => {
  try {
    const { urlId } = req.params;

    if (!urlId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json('Invalid URL ID');
    }

    const url = await Url.findById(urlId);

    if (url) {
      await url.deleteOne();
      res.json({ message: 'URL deleted successfully' });
    } else {
      res.status(404).json('URL not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
};
