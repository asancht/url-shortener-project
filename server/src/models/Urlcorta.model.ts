import mongoose, { Document } from "mongoose";
import { customAlphabet } from "nanoid";
import dotenv from "dotenv";
dotenv.config();

const nanoid = customAlphabet(process.env.ALPHABET_ID!, 7);

export interface URLCorta extends Document {
  URLcortaId: string;
  URLoriginal: string;
  enabled: boolean;
}

const schema = new mongoose.Schema({
  URLcortaId: {
    type: String,
    unique: true,
    required: true,
    default: () => nanoid(),
  },
  URLoriginal: { 
    type: String, 
    required: true,
  },
  habilitada: { 
      type: Boolean, 
      default: () => true,
  },
});

const URLcorta = mongoose.model<URLCorta>("URLcorta", schema);

export default URLcorta;
