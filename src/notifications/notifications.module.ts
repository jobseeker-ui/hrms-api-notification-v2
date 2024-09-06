import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConnectionNameEnum } from 'src/common/enums/connection-name.enum'
import { Applicant, ApplicantSchema } from 'src/schemas/applicant.schema'
import { Employee, EmployeeSchema } from 'src/schemas/employee.schema'
import { Notification, NotificationSchema } from '../schemas/notification.schema'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }], ConnectionNameEnum.NOTIFICATION),
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }], ConnectionNameEnum.EMPLOYEE),
    MongooseModule.forFeature([{ name: Applicant.name, schema: ApplicantSchema }], ConnectionNameEnum.VACANCY),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
