import shortid from 'shortid';
import Url from '../models/UrlModel';

export const isUrlCodeExists = async () => {
  const urlCode = shortid.generate();

  const code = await Url.findOne({ urlCode });

  if (code) {
    isUrlCodeExists();
  }

  return urlCode;
};
