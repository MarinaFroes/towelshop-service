import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../helpers/apiError'

import { UserDocument } from '../models/User'
import generateToken from '../util/generateToken'

// @desc   GoogleTokenId auth
// @route  POST /api/v1/auth/google-authenticate
// @access Public
// export const googleCallback = (req: Request, res: Response) => {
//   if (req.user) {
//     const user: UserDocument = req.user as UserDocument

//     const token = generateToken(user._id)
//     token && res.cookie('token', token)

//     res.redirect('/')
//   } else {
//     res.status(401).send('Unauthorized')
//   }
// }
export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: UserDocument = req.user as UserDocument

    if (!user) {
      throw new Error()
    }

    const token = generateToken(user._id)
    token && res.cookie('token', token)
    res.send({ token })
  } catch (error) {
    next(new UnauthorizedError('Not authorized', error))
  }
}
// @desc   Logout user
// @route  GET /api/v1/auth/logout
// @access Public
export const logoutUser = (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
}
