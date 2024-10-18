import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConnectionNameEnum } from 'src/common/enums/connection-name.enum'
import { NotificationsModule } from 'src/notifications/notifications.module'
import { Applicant, ApplicantSchema, Vacancy } from 'src/schemas/applicant.schema'
import { Employee, EmployeeSchema } from 'src/schemas/employee.schema'
import { Notification, NotificationSchema } from 'src/schemas/notification.schema'
import { VacancySchema } from 'src/schemas/vacancy.schema'
import { SnsModule } from 'src/sns/sns.module'
import { VacancyPublishedService } from './vacancy-published.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }], ConnectionNameEnum.NOTIFICATION),
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }], ConnectionNameEnum.EMPLOYEE),
    MongooseModule.forFeature([{ name: Applicant.name, schema: ApplicantSchema }], ConnectionNameEnum.VACANCY),
    MongooseModule.forFeature([{ name: Vacancy.name, schema: VacancySchema }], ConnectionNameEnum.VACANCY),
    NotificationsModule,
    SnsModule,
  ],
  providers: [VacancyPublishedService],
  exports: [VacancyPublishedService],
})
export class VacancyPublishedModule {}
