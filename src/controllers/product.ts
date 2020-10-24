import { Request, Response, NextFunction } from 'express'

import Product from '../models/Product'
import ProductService from '../services/product'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// @desc   Create product
// @route  POST /products
// @access Private, role admin
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      categories,
      variant,
      size,
      price,
      mediaUrl,
      countInStock
    } = req.body

    const product = new Product({
      name,
      description,
      categories,
      variant,
      size,
      price,
      mediaUrl,
      countInStock
    })

    await ProductService.create(product)
    res.json(product)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// @desc   Update product
// @route  PUT /products/:productId
// @access Private, role admin
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const productId = req.params.productId

    const updatedProduct = await ProductService.update(productId, update)
    res.json(updatedProduct)
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// @desc   Delete product
// @route  DELETE /products/:productId
// @access Private, role admin
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ProductService.deleteProduct(req.params.productId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// @desc   Get single product
// @route  GET /products/:productId
// @access Public
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findById(req.params.productId))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// @desc   Get all products with pagination
// @route  GET /products
// @access Public
export const findPaginated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageData = await ProductService.findPaginated(req.query)
    res.json({...pageData})
  } catch (error) {
    next(new NotFoundError('Products not found', error))
  }
}

// @desc   Get all products no pagination
// @route  GET /products/all
// @access Public
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findAll())
  } catch (error) {
    next(new NotFoundError('Products not found', error))
  }
}
