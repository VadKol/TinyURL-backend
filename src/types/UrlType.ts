import { Document } from 'mongoose';

export default interface UrlType extends Document {
  urlCode: string;
  longUrl: string;
  shortUrl: string;
  date: string;
}
