import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Handler, SQSEvent } from 'aws-lambda'
import { AppModule } from '../app.module'
import { NotificationBuilderService } from './notification-builder.service'

let cachedApp: INestApplication | null = null

async function bootstrap(): Promise<INestApplication> {
  if (cachedApp) {
    return cachedApp
  }
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties not present in the DTO
      forbidNonWhitelisted: true, // Throw an error if unknown properties are passed
    }),
  )
  cachedApp = app
  return app
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler: Handler = async (event: SQSEvent) => {
  const app = await bootstrap()
  const notificationBuilderService = app.get(NotificationBuilderService)
  await notificationBuilderService.handleSQSMessages(event)
}
