import express from 'express'
import compression from 'compression'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import lusca from 'lusca'
import cors from 'cors'
import mongo from 'connect-mongo'
import mongoose from 'mongoose'
import passport from 'passport'
import bluebird from 'bluebird'
import './config/passport'

import { MONGODB_URI, SESSION_SECRET } from './util/secrets'
import productRouter from './routers/product'
import userRouter from './routers/user'
import authRouter from './routers/auth'
import connectDb from './config/db'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

const app = express()
const mongoUrl = MONGODB_URI

const MongoStore = mongo(session)

mongoose.Promise = bluebird
connectDb()

// Express configuration
app.set('port', process.env.PORT || 3000)

// Use common 3rd-party middlewares
app.use(compression())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(cors())

// Sessions
app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true,
    }),
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Use Google auth router
app.use('/api/v1/auth', authRouter)

// Use product router
app.use('/api/v1/products', productRouter)

// Use user router
app.use('/api/v1/users', userRouter)

// Custom API error handler
app.use(apiErrorHandler)

// API content type
app.use(apiContentType)

export default app
