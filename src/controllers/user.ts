import { Request, Response, NextFunction } from 'express'

import generateToken from '../util/generateToken'
import UserService from '../services/user'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  ForbiddenError
} from '../helpers/apiError'

// @desc   Create new user
// @route  POST /api/users/signup
// @access Public
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName, firstName, lastName, email, password } = req.body

    const createdUser = await UserService.create(userName, firstName, lastName, email, password )

    if (createdUser) {
      const authedUser = {
        _id: createdUser._id,
        userName,
        firstName,
        lastName,
        email,
        token: generateToken(createdUser._id)
      }
      res.json(authedUser)
    } else {
      next(new InternalServerError('Could not create user'))
    }
    
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// @desc   Update user
// @route  PUT /users/:userId
// @access Private
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
   
    const updatedUser = await UserService.update(userId, update)
    res.json(updatedUser)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// @desc   Delete user
// @route  DELETE /users/:userId
// @access Private
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// @desc   Get single user
// @route  GET /users/:userId
// @access Private
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findById(req.params.userId))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// @desc   Get a list of all users
// @route  GET /users
// @access Private, Role Admin
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findAll())
  } catch (error) {
    next(new NotFoundError('Users not found', error))
  }
}

// @desc   Unban user
// @route  POST /users/:userId/unban-user
// @access Private, Role Admin
export const unbanUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.unban(req.params.userId)
    res.status(200).send(`User id ${req.params.userId} is unbanned`)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// @desc   Ban user
// @route  POST /users/:userId/ban-user
// @access Private, Role Admin
export const banUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.ban(req.params.userId)
    res.status(200).send(`User id ${req.params.userId} is banned`)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// @desc   Auth user
// @route  POST /users/login
// @access Public
export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    const user = await UserService.authenticate(email, password)
    
    const { _id, firstName, lastName, userName, role, isBanned } = user

    const authedUser = {
      _id,
      userName, 
      firstName,
      lastName,
      email,
      role, 
      isBanned,
      token: generateToken(_id)
    }

    if (isBanned) {
      next(new ForbiddenError('User is banned. Cannot login in.'))
    }
    
    if (!isBanned && user) {
      res.status(200).json(authedUser)
    }
  
  } catch (err) {
    next(new NotFoundError('User not found', err))
  }
}
