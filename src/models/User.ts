import mongoose, { Document, HookNextFunction } from 'mongoose'
import bcrypt from 'bcrypt'

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
    userName: String,
    googleId: String,
    image: String,
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'admin', 'root'],
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
