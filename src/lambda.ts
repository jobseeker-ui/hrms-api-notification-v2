import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { Handler } from 'aws-lambda'
import serverless from 'serverless-http'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AppModule } from './sns/app.module'

process.env.NO_COLOR = 'true'

let server: Handler

const SLS = serverless || require('serverless-http')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter())
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())
  await app.init()
  return SLS?.(app.getHttpAdapter().getInstance())
}

export const handler: Handler = async (...ctx) => {
  server = server ?? (await bootstrap())
  return server?.(...ctx)
}
