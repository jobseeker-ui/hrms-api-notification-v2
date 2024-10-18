import { Module } from '@nestjs/common'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { SnsModule } from 'src/sns/sns.module'
import { CandidateAppliedModule } from './builders/candidate-applied.module'
import { VacancyPublishedModule } from './builders/vacancy-published.module'
import { NotificationBuilderService } from './notification-builder.service'

@Module({
  imports: [NotificationsModule, SnsModule, CandidateAppliedModule, VacancyPublishedModule],
  providers: [NotificationBuilderService],
})
export class NotificationBuilderModule {}
