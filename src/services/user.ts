import User, { UserDocument } from '../models/User'
import Cart from '../models/Cart'

const create = async (
  userName: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role?: string
) => {

  const newUser = await new User({
    userName,
    firstName,
    lastName,
    email,
    password,
    role
  }).save()

  await new Cart({ user: newUser._id }).save()

  return newUser
}

const findById = async (userId: string) => {
  return await User.findById(userId)   
}

const authenticate = async (
  email: string,
  enteredPassword: string
) => {
  const user = await User.findOne({ email }).select('+password')

  let isMatch = false

  if (user) {
    isMatch = await user.matchPassword(enteredPassword)
  } 

  return user && isMatch ? user : null
}

const findAll = async () => {
  return await User.find().sort({ lastName: 1 })
}

const update = async (
  userId: string,
  update: Partial<UserDocument>
) => {
  const user = await User.findById(userId)
    
  if (!user) {
    return null
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

  return await user.save()
}

const deleteUser = async (userId: string) => {
  return await User.findByIdAndDelete(userId)
}

const ban = async (userId: string) => {
  return await User.findByIdAndUpdate({ _id: userId }, { isBanned: true })
}

const unban = async (userId: string) => {
  return await User.findByIdAndUpdate({ _id: userId }, { isBanned: false })
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
