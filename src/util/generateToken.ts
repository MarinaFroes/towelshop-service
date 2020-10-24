import jwt from 'jsonwebtoken'

import {JWT_SECRET} from './secrets'

const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '1d',
  })
}

export default generateToken
