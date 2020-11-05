import mongoose from 'mongoose'

import { MONGODB_URI } from '../util/secrets'

const mongoUrl = MONGODB_URI

const connectDb = async () => {
  try {
const conn = await mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
     console.log(
        'MongoDB connection error. Please make sure MongoDB is running. ' + err
      )
      process.exit(1)
  }
}

export default connectDb