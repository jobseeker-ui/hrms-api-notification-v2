import morgan from 'morgan'
import { createLogger, format, transports } from 'winston'

// Create a Winston logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: process.env.SERVICE_NAME || 'your-service-name' },
  transports: [new transports.Console({ format: format.combine(format.colorize(), format.simple()) })],
})

// Function to setup Morgan middleware based on environment
const setupLogger = (env: string | undefined) => {
  switch (env) {
    case 'staging':
    case 'production':
      return morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      })
    default:
      return morgan('dev')
  }
}

export { logger, setupLogger }
