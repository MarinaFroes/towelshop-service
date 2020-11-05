import Product, { ProductDocument } from '../models/Product'
import Cart from '../models/Cart'
import { Query } from '../types/types'
import searchFilters from '../util/searchFilters'

const create = async (product: ProductDocument) => {
  return await product.save()
}

const findById = async (productId: string) => {
  return await Product.findById(productId)
}

const findPaginated = async (query: Query) => {
  const filters = searchFilters(query)
  const docNum = await Product.countDocuments({ $and: filters })
  const productsPerPage = 3
  const totalPages: number = Math.ceil(docNum / productsPerPage)
  const pageNum: number = Number(query.page) || 0

  if (pageNum > totalPages) {
    throw new Error()
  }

  const skips = !pageNum || pageNum === 1 ? 0 : productsPerPage * (pageNum - 1)

  const products = await Product.find({ $and: filters })
    .skip(skips)
    .limit(productsPerPage)
    .sort({ name: 1 })
  
  return {
    items: products,
    totalPages,
  } 
}

const findAll = async () => {
  return await Product.find().sort({ name: 1 })
}

const update = async (
  productId: string,
  update: Partial<ProductDocument>
) => {
  const product = await  Product.findById(productId)
  
  if (!product) {
    return null
  }

  if (update.name) {
    product.name = update.name
  }
  if (update.description) {
    product.description = update.description
  }
  if (update.categories) {
    product.categories = update.categories
  }
  if (update.variant) {
    product.variant = update.variant
  }
  if (update.size) {
    product.size = update.size
  }
  if (update.price) {
    product.price = update.price
  }
  if (update.mediaUrl) {
    product.mediaUrl = update.mediaUrl
  }
  if (update.countInStock) {
    product.countInStock = update.countInStock
  }

  return await product.save()
}

const deleteProduct = async (productId: string) => {
  await Product.findByIdAndDelete(productId)

  await Cart.updateMany(
    { 'products.product': productId },
    { $pull: { products: { product: productId } } }
  )
}

export default {
  create,
  findById,
  findAll,
  findPaginated,
  update,
  deleteProduct,
}
