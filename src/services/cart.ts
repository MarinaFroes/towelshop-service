import mongoose from 'mongoose'

import Cart, { CartDocument } from '../models/Cart'
import '../models/Product'

const { ObjectId } = mongoose.Types

const findAll = async () => {
  return await Cart.find()
}

const findByUserId = async (userId: string) => {
  return await Cart.findOne({ user: userId }).populate({
    path: 'products.product',
    model: 'Product'
  })
}

const update = async (userId: string, productId: string, qty: number) => {
  const cart: CartDocument | null = await Cart.findOne({ user: userId })
  
  let updatedCart

  if (!cart) {
    return null
  }

  const productExists: boolean = cart.products.some((doc) => ObjectId(productId).equals(doc.product)) 

  if (productExists) {
    updatedCart = await Cart.findOneAndUpdate(
      { _id: cart._id, 'products.product': productId },
      { $inc: { 'products.$.quantity': qty } },
      { new: true }
    ).populate({
      path: 'products.product',
      model: 'Product'
    })

  } else {
    const newProduct = { quantity: qty, product: productId }

    updatedCart = await Cart.findOneAndUpdate(
      { _id: cart._id },
      { $addToSet: { products: newProduct } },
      { new: true }
    ).populate({
      path: 'products.product',
      model: 'Product'
    })
  }

  return updatedCart
}

const deleteProduct = async (userId: string, productId: string) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { products: { product: productId } } },
    { new: true }
  ).populate({
    path: 'products.product',
    model: 'Product'
  })

  if (!cart) {
    return null
  } else {
    return cart
  }
}

export default {
  findByUserId,
  update,
  deleteProduct,
  findAll
}
