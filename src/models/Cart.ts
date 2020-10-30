import mongoose, { Document } from 'mongoose'

type ProductInfo = {
  quantity: number;
  product: mongoose.Types.ObjectId;
}

export type CartDocument = Document & {
  user: mongoose.Types.ObjectId;
  products: ProductInfo[];
}

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      quantity: Number,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    },
  ],
})

export default mongoose.model<CartDocument>('Cart', cartSchema)
