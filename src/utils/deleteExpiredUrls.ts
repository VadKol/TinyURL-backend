import Url from '../models/UrlModel';

export const deleteExpiredUrls = async () => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    await Url.deleteMany({ date: { $lt: oneYearAgo } });
  } catch (err) {
    console.error(err);
  }
};

setInterval(deleteExpiredUrls, 24 * 60 * 60 * 1000);
