process.env.NO_COLOR = 'true'

import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  // Get the ConfigService from the application context
  const configService = app.get(ConfigService)

  // Retrieve the port from the configuration
  const port = configService.get<number>('PORT') || 3000

  await app.listen(port, '0.0.0.0')
}

bootstrap()
