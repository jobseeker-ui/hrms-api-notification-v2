import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import serverless, { Handler } from 'serverless-http'
import { AppModule } from './app.module'

process.env.NO_COLOR = 'true'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter())

  const configService = app.get(ConfigService)
  await app.listen(configService.get('PORT'))

  app.enableCors()

  if (!server) server = serverless(app.getHttpAdapter().getInstance())
  Logger.log(`Application is running on port ${configService.get('PORT')}`, 'Authorizer Bootstrap')
  return server
}
bootstrap()

let server: Handler

export const handler: Handler = async (event, context) => {
  server = server ?? (await bootstrap())
  return server(event, context)
}
