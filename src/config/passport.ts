import passport from 'passport'
const GoogleTokenStrategy = require('passport-google-id-token')

import User from '../models/User'
import { GOOGLE_CLIENT_ID } from '../util/secrets'
import { ParsedToken } from '../types/types'

passport.serializeUser<any, any>((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
    },
    async (parsedToken: ParsedToken, googleId: string, done: (error: any, user?: any) => void) => {
      const { payload } = parsedToken
      const { given_name, family_name, name, email, picture } = payload

      const newUser = {
        googleId: googleId,
        userName: name,
        firstName: given_name,
        lastName: family_name,
        image: picture,
        email: email,
      }

      try {
        let user = await User.findOne({ email: newUser.email })

        if (!user) {
          user = await User.create(newUser)
        } 

        done(null, user)
      } catch (err) {
        console.error(err)
        done(err, null)
      }
    }
  )
)
