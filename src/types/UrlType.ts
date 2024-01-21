import { Document } from 'mongoose';

export default interface UrlModel extends Document {
  urlCode: string;
  longUrl: string;
  shortUrl: string;
  date: string;
}
