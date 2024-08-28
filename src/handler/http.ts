import 'reflect-metadata'

import serverless from 'serverless-http'
import Application from '../app'

const { app } = new Application()

export const handler = serverless(app)
