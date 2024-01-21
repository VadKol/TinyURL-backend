import { model, Schema, Document, Model } from 'mongoose';

export interface IUrl extends Document {
  hashedValues: string;
  originalURL: string,
  creationDate: Date,
  expirationDate: Date
}

const urlSchema: Schema = new Schema({
  hashedValues: {
    required: true,
    type: String
  },
  originalURL: {
    required: true,
    type: String
  },
  creationDate: {
    required: true,
    type: Date
  },
  expirationDate: {
    requried: true,
    type: Date
  }
});

const TinyUrl: Model<IUrl> = model<IUrl>('urls', urlSchema);

export default TinyUrl;
