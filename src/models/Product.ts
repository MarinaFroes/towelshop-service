import mongoose, { Document } from 'mongoose'

export type ProductDocument = Document & {
  name: string;
  description: string;
  categories: string[];
  variant: string;
  countInStock: number;
  size: string;
  price: number;
  mediaUrl: string;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 1,
  },
  description: {
    type: String,
    required: true,
  },
  categories: [String],
  variant: String,
  size: String,
  mediaUrl: {
    type: String,
    required: true,
  },
})

export default mongoose.model<ProductDocument>('Product', productSchema)
