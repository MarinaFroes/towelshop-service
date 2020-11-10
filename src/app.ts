import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import lusca from 'lusca'
import cors from 'cors'
import mongoose from 'mongoose'
import passport from 'passport'
import bluebird from 'bluebird'

import './config/passport'
import productRouter from './routers/product'
import userRouter from './routers/user'
import authRouter from './routers/auth'
import cartRouter from './routers/cart'
import connectDb from './config/db'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

const app = express()

mongoose.Promise = bluebird
connectDb()

// Express configuration
app.set('port', process.env.PORT || 5000)

// Use common 3rd-party middlewares
app.use(compression())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(cors())

// Passport middleware
app.use(passport.initialize())

// Use Google auth router
app.use('/api/v1/auth', authRouter)

// Use product router
app.use('/api/v1/products', productRouter)

// Use user router
app.use('/api/v1/users', userRouter)

// Use cart router
app.use('/api/v1/cart', cartRouter)

// Custom API error handler
app.use(apiErrorHandler)

// API content type
app.use(apiContentType)

export default app
