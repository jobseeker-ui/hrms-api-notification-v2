import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ConnectionNameEnum } from './common/enums/connection-name.enum'
import { NotificationBuilderModule } from './notification-builder/notification-builder.module'
import { NotificationsModule } from './notifications/notifications.module'
import { SnsModule } from './sns/sns.module'

const connections = [
  ConnectionNameEnum.CANDIDATE,
  ConnectionNameEnum.EMPLOYEE,
  ConnectionNameEnum.NOTIFICATION,
  ConnectionNameEnum.WS_CONNECTION,
  ConnectionNameEnum.VACANCY,
]

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...connections.map((name) =>
      MongooseModule.forRootAsync({
        connectionName: name, // Use dynamic connection name
        useFactory: (configService: ConfigService) => {
          const logger = new Logger(`MDB :: ${name}`)
          return {
            uri: configService.get<string>('ATLAS_ACCESS'),
            dbName: configService.get<string>(`DB_${name}`),
            autoIndex: true,
            connectionFactory: (connection) => {
              connection.on('connected', () => {
                logger.log(`Connected to DB ${connection.db.databaseName} on host ${connection.host} on port ${connection.port}`)
              })
              connection.on('error', (err) => {
                logger.error(`Error connecting to MongoDB: ${err}`)
              })
              connection.on('disconnected', () => {
                logger.warn('Disconnected from MongoDB')
              })
              return connection
            },
          }
        },
        inject: [ConfigService],
      }),
    ),
    NotificationsModule,
    NotificationBuilderModule,
    SnsModule,
  ],
})
export class AppModule {}
