import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties not present in the DTO
      forbidNonWhitelisted: true, // Throw an error if unknown properties are passed
    }),
  )
  // Get the ConfigService from the application context
  const configService = app.get(ConfigService)

  // Retrieve the port from the configuration
  const port = configService.get<number>('PORT') || 3000

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())
  await app.listen(port, '0.0.0.0')
}

bootstrap()
