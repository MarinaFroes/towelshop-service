import { Request, Response, NextFunction } from 'express'

import Product from '../models/Product'
import ProductService from '../services/product'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// @desc   Create new product
// @route  POST /api/v1/products
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
      countInStock,
    } = req.body

    let product = new Product({
      name,
      description,
      categories,
      variant,
      size,
      price,
      mediaUrl,
      countInStock,
    })

    product = await ProductService.create(product)

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
// @route  PUT api/v1/products/:productId
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

    if (!updatedProduct) {
      next(new NotFoundError('Product not found'))
    }

    res.json(updatedProduct)
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Product id is invalid', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// @desc   Delete product
// @route  DELETE api/v1/products/:productId
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
// @route  GET api/v1/products/:productId
// @access Public
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await ProductService.findById(req.params.productId)

    if (!product) {
      throw new Error()
    }

    res.json(product)
  } catch (error) {
    next(new NotFoundError('Product not found'))
  }
}

// @desc   Get all products with pagination
// @route  GET api/v1/products
// @access Public
export const findPaginated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageData = await ProductService.findPaginated(req.query)
    res.json({ ...pageData })
  } catch (error) {
    next(new NotFoundError('Products not found', error))
  }
}

// @desc   Get all products no pagination
// @route  GET api/v1/products/all
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
