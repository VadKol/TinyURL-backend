import mongoose, { Schema } from 'mongoose';
import UrlType from '../types/UrlType';

export const UrlSchema: Schema = new Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  date: { type: String, default: Date.now },
});

export default mongoose.model<UrlType>('UrlModel', UrlSchema);
