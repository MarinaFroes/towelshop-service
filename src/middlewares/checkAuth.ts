import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../util/secrets'
import UserService from '../services/user'

import {
  UnauthorizedError,
} from '../helpers/apiError'
import { DecodedData } from '../types/types'
import { UserDocument } from '../models/User'

export default function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token

  if (req.cookies.token) {
    token = req.cookies.token
  }

  if (req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  
  if (token) {
    try {
      const jwtPayload: object | string = jwt.verify(token, JWT_SECRET)

      const decodedUserData: DecodedData = jwtPayload as DecodedData
            
      if (decodedUserData.id) {
        UserService.findById(decodedUserData.id).then(user => {
          req.user = user as UserDocument
          next()
        })
      }
        
    } catch (err) {
      next(new UnauthorizedError('Not authorized, token failed'))
    }
  } else {
    next(new UnauthorizedError('Not authorized, no token'))
  }
}
