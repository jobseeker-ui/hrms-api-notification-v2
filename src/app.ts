import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import ErrorHandler from './classes/ErrorHandler'
import SuccessHandler from './classes/SuccessHandler'
import { connectDB } from './config/connect'
import { setupLogger } from './config/logger'
import { setupNotificationRoute } from './routes/notifications.route'

connectDB()

class Application {
  public app: express.Application

  constructor() {
    this.app = express()
    connectDB().then(() => {
      this.config()

      new SuccessHandler(this.app)

      this.router()

      new ErrorHandler(this.app)
    })
  }

  config() {
    this.app.enable('trust proxy')

    this.app.use(cors({ origin: '*', allowedHeaders: '*' }))
    this.app.use(setupLogger(process.env.NODE_ENV))
    this.app.use(helmet())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  router() {
    setupNotificationRoute(this.app)
  }
}

export default Application
