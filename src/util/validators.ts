import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

export const nameValidator = (value: string) => {
  return isLength(value, { min: 3, max: 20 })
}

export const emailValidator = (email: string) => {
  return isEmail(email)
}

export const passwordValidator = (password: string) => {
  return isLength(password, { min: 6 })
}
