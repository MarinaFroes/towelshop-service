import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

import User, { UserDocument } from '../models/User'

// FIXME: REFACTOR TO USE ONLY ASYNC AWAIT HERE 
async function create(userName: string, firstName: string, lastName: string, email: string, password: string): Promise<UserDocument> {

  if (!userName || !firstName || !lastName || !email || !password) {
    throw new Error('One or more required fields missing')
  }

  if (
    !isLength(userName, { min: 3, max: 20 }) ||
    !isLength(firstName, { min: 3, max: 20 }) ||
    !isLength(lastName, { min: 3, max: 20 })
  ) {
    throw new Error('Name must be 3-20 characters long')
  } else if (!isLength(password, { min: 6 })) {
    throw new Error('Password must be at least 6 characters long')
    
  } else if (!isEmail(email)) {
    throw new Error('Email must be valid')
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error(`User already exists with email ${email}`)
  }

  const newUser = new User({
    userName,
    firstName,
    lastName,
    email,
    password,
  })

  const createdUser = await User.create(newUser)

  return createdUser
}

function findById(userId: string): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      return user
    })
}

function authenticate(
  email: string,
  enteredPassword: string
): Promise<UserDocument> {
  return User.findOne({ email })
    .select('+password')
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error('User not found')
      } else {
        return user.matchPassword(enteredPassword).then(isMatch => {
          if (isMatch) {
            return user
          } else {
            throw new Error('Passwords do not match')
          }
        })
      }
    })
}

function findAll(): Promise<UserDocument[]> {
  return User.find().sort({ lastName: 1 }).exec()
}

function update(
  userId: string,
  update: Partial<UserDocument>
): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }

      if (update.userName) {
        user.userName = update.userName
      }
      if (update.firstName) {
        user.firstName = update.firstName
      }
      if (update.lastName) {
        user.lastName = update.lastName
      }
      if (update.email) {
        user.email = update.email
      }

      return user.save()
    })
}

function deleteUser(userId: string): Promise<UserDocument | null> {
  return User.findByIdAndDelete(userId).exec()
}

function ban(userId: string): Promise<UserDocument | null> {
  return User.findByIdAndUpdate({ _id: userId }, { isBanned: true }).exec()
}

function unban(userId: string): Promise<UserDocument | null> {
  return User.findOneAndUpdate({ _id: userId }, { isBanned: false }).exec()
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteUser,
  ban,
  unban,
  authenticate,
}
