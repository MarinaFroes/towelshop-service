import mongoose, { Document, HookNextFunction } from 'mongoose'
import bcrypt from 'bcrypt'

import { nameValidator, emailValidator, passwordValidator } from '../util/validators'

export type UserDocument = Document & {
  googleId?: string;
  image?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  role: string;
  isBanned: boolean;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      validate: nameValidator
    },
    googleId: String,
    image: String,
    firstName: {
      type: String,
      validate: nameValidator
    },
    lastName: {
      type: String,
      validate: nameValidator
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: emailValidator
    },
    password: {
      type: String,
      select: false,
      validate: passwordValidator
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'admin'],
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (this: UserDocument, next: HookNextFunction) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export default mongoose.model<UserDocument>('User', userSchema)
