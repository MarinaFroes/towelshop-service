import mongoose from 'mongoose'
import bluebird from 'bluebird'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongod = new MongoMemoryServer()
mongoose.Promise = bluebird

export const connect = async () => {
  const uri = await mongod.getUri()

  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }

  await mongoose.connect(uri, mongooseOpts)
}

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}
