import { Request, Response, NextFunction } from 'express'
import {
  ForbiddenError,
} from '../helpers/apiError'
import { UserDocument } from '../models/User'

export default function checkRole(permittedRole: string) {
  return function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user: UserDocument = req.user as UserDocument

    if (user && user.role === permittedRole) {
      next()
    } else {
      next(new ForbiddenError('No permission'))
    }
  }
}