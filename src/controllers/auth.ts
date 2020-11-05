import { Request, Response, NextFunction } from 'express'

import { BadRequestError, InternalServerError } from '../helpers/apiError'
import { UserDocument } from '../models/User'
import generateToken from '../util/generateToken'

// @desc   GoogleTokenId auth
// @route  POST /api/v1/auth/google-authenticate
// @access Public
export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
   try {
    const user: UserDocument = req.user as UserDocument

    const token = generateToken(user._id)
    token && res.cookie('token', token)
    res.send({ token })
   
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'MongoError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// @desc   Logout user
// @route  GET /api/v1/auth/logout
// @access Public
export const logoutUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.logout()
    res.redirect('/')
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
