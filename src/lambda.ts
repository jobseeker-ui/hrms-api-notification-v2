import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { Handler } from 'aws-lambda'
import serverless from 'serverless-http'
import { AppModule } from './sns/app.module'

process.env.NO_COLOR = 'true'

let server: Handler

const SLS = serverless || require('serverless-http')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter())
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties not present in the DTO
      forbidNonWhitelisted: true, // Throw an error if unknown properties are passed
    }),
  )
  await app.init() // Important to initialize the app
  return SLS?.(app.getHttpAdapter().getInstance()) // Wrap the Fastify app with serverless-http
}

export const handler: Handler = async (...ctx) => {
  server = server ?? (await bootstrap())
  return server?.(...ctx)
}
