import Product, { ProductDocument } from '../models/Product'
import { Query, Page } from '../types/types'
import searchFilters from '../util/searchFilters'

function create(product: ProductDocument): Promise<ProductDocument> {
  return product.save()
}

function findById(productId: string): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec()
    .then((product) => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }
      return product
    })
}

function findPaginated(query: Query): Promise<Page<ProductDocument>> {

  const filters = searchFilters(query)
  
  return Product.countDocuments({ $and: filters })
    .then((docNum) => {
      const productsPerPage = 3
      const totalPages: number = Math.ceil(docNum / productsPerPage)
      const pageNum: number = Number(query.page) || 0

      if (pageNum > totalPages) {
        throw new Error()
      }

      const skips =
        !pageNum || pageNum === 1 ? 0 : productsPerPage * (pageNum - 1)

      return Product.find({ $and: filters })
        .skip(skips)
        .limit(productsPerPage)
        .sort({ name: 1 })
        .then((products) => {
          return {
            items: products,
            totalPages,
          }
        })
    })
}

function findAll(): Promise<ProductDocument[]> {
  return Product.find().sort({ name: 1 }).exec()
}

function update(
  productId: string,
  update: Partial<ProductDocument>
): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec()
    .then((product) => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
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

      return product.save()
    })
}

function deleteProduct(productId: string): Promise<ProductDocument | null> {
  return Product.findByIdAndDelete(productId).exec()
}

export default {
  create,
  findById,
  findAll,
  findPaginated,
  update,
  deleteProduct,
}
