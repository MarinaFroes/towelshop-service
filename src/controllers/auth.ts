import { Request, Response } from 'express'

import { UserDocument } from '../models/User'
import generateToken from '../util/generateToken'

// @desc   GoogleTokenId auth
// @route  POST /api/v1/auth/google-authenticate
// @access Public
export const googleCallback = (req: Request, res: Response) => {
  if (req.user) {
    const user: UserDocument = req.user as UserDocument

    const token = generateToken(user._id)
    token && res.cookie('token', token)
    
    res.status(200).redirect('https://sharp-curie-5f9df0.netlify.app/')
  } else {
    res.status(401).send('Unauthorized')
  }
}

// @desc   Logout user
// @route  GET /api/v1/auth/logout
// @access Public
export const logoutUser = (req: Request, res: Response) => {
  req.logout()
  res.status(200).send('Logged out')
}
