// config/connect.ts

import { connect, Mongoose } from 'mongoose'
import { logger } from './logger'

let connection: Mongoose

export const connectDB = async () => {
  if (connection) return connection
  try {
    logger.info('Connecting to MongoDB...')
    connection = await connect(String(process.env.ATLAS_ACCESS), {
      socketTimeoutMS: 0,
      connectTimeoutMS: 0,
    })
    logger.info('Connected to MongoDB')
    return connection
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error)
  }
}
