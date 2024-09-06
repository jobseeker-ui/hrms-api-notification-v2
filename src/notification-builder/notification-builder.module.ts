import { Module } from '@nestjs/common'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { SnsModule } from 'src/sns/sns.module'
import { NotificationBuilderService } from './notification-builder.service'

@Module({
  imports: [NotificationsModule, SnsModule],
  providers: [NotificationBuilderService],
})
export class NotificationBuilderModule {}
