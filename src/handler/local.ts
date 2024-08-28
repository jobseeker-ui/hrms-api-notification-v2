import 'reflect-metadata'

import dotenv from 'dotenv'
dotenv.config()

import Application from '../app'
import { logger } from '../config/logger'

/**
 * Initialize the application and start the server
 */
const { app } = new Application()

// Get the port from environment variables or default to 3000
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 3000

/**
 * Start the Express server and listen on the specified port
 */
app.listen(PORT, () => {
  const hostUrl = `http://localhost:${PORT}`
  logger.info('🚀 Server is running!', { port: PORT, url: hostUrl })
})
