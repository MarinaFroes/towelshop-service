import express from 'express'
import passport from 'passport'

import '../config/passport'
import { logoutUser, googleCallback } from '../controllers/auth'

const router = express.Router()

router.post(
  '/google-authenticate',
  passport.authenticate('google-id-token', { session: false }),
  googleCallback
)
router.get('/logout', logoutUser)

export default router
