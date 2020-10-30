import { Request, Response, NextFunction } from 'express'

import CartService from '../services/cart'
import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  BadRequestError,
} from '../helpers/apiError'
import { UserDocument } from '../models/User'

// @desc   Get all carts
// @route  GET /api/v1/cart/all
// @access Private, role admin
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await CartService.findAll())
  } catch (error) {
    next(new NotFoundError('Carts not found', error))
  }
}

// @desc   Add product to cart
// @route  PUT /api/v1/cart
// @access Private
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, qty } = req.body

    const user: UserDocument = req.user as UserDocument

    if (!productId || !qty) {
      next(new BadRequestError('Product id or quantity missing'))
    }

    if (user && user._id) {
      const updatedCart = await CartService.update(user._id, productId, qty)
      res.status(200).json(updatedCart)
    } else {
      next(new UnauthorizedError('Login to see cart'))
    }
  } catch (error) {
    next(new NotFoundError('Cart not found', error))
  }
}

// @desc   Remove product from cart
// @route  DELETE /api/v1/cart
// @access Private
export const removeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body
    const user: UserDocument = req.user as UserDocument

    if (user && user._id) {
      const updatedCart = await CartService.deleteProduct(user._id, productId)

      res.status(200).json(updatedCart)
    } else {
      next(new UnauthorizedError('Login to see cart'))
    }
  } catch (error) {
    next(new InternalServerError('Could not remove product', error))
  }
}

// @desc   Get cart
// @route  GET /api/v1/cart
// @access Private
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: UserDocument = req.user as UserDocument

    if (user && user._id) {
      const cart = await CartService.findByUserId(user._id)
      res.json(cart)
    } else {
      next(new UnauthorizedError('Login to see cart'))
    }
  } catch (error) {
    next(new NotFoundError('Cart not found', error))
  }
}
