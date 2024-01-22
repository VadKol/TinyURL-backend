import config from 'config';
import { Request, Response } from 'express';
import validUrl from 'valid-url';
import UrlModel from '../models/UrlModel';
import { isUrlCodeExists } from '../utils/isUrlCodeExists';

export const getAllUrls = async (req: Request, res: Response) => {
  try {
    const urls = await UrlModel.find();
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get superheroes' });
  }
};

export const getShortenUrl = async (req: Request, res: Response) => {
  try {
    const urlObject = await UrlModel.findOne({ urlCode: req.params.urlCode });

    return urlObject
      ? res.redirect(urlObject.longUrl)
      : res.status(404).json('No url found!');
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
};

export const createShortUrl = async (req: Request, res: Response) => {
  const { longUrl } = req.body;
  const baseUrl = config.get('baseUrl');

  if (!validUrl.isUri(baseUrl as string)) {
    return res.status(401).json('Invalid base URL!');
  }

  if (validUrl.isUri(longUrl)) {
    try {
      let url = await UrlModel.findOne({ longUrl });

      if (url) {
        return res.json(url);
      } else {
        const urlCode = await isUrlCodeExists();
        const shortUrl = 'https://' + urlCode;

        url = new UrlModel({
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
    res.status(401).json('Invalid long URL');
  }
};

export const redirectToLongUrl = async (req: Request, res: Response) => {
  const { urlCode } = req.params;

  try {
    const url = await UrlModel.findOne({ urlCode });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      res.status(404).json('URL not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
};

export const inputLongUrl = async (req: Request, res: Response) => {
  const { shortUrl } = req.body;

  if (validUrl.isUri(shortUrl)) {
    try {
      const url = await UrlModel.findOne({ shortUrl });

      return url
        ? res.json(url)
        : res.status(404).json('No url found');
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
    const { urlCode } = req.params;

    if (!urlCode.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json('Invalid URL ID');
    }

    const url = await UrlModel.findById(urlCode);

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
