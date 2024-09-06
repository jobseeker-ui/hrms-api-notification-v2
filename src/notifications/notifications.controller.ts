import { Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { Types } from 'mongoose'
import { EmployeeId } from 'src/common/decorators/employee-id.decorator'
import { IsMongoIdPipe } from 'src/common/pipes/is-mongo-id.pipe'
import { PaginateNotificationsDto } from './dto/paginate-notifications.dto'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  paginate(@Query() paginateNotificationsDto: PaginateNotificationsDto, @EmployeeId() employeeId: Types.ObjectId) {
    return this.notificationsService.paginate(employeeId, paginateNotificationsDto)
  }

  @Patch(':id')
  markAsRead(@Param('id', IsMongoIdPipe) notificationId: Types.ObjectId, @EmployeeId() employeeId: Types.ObjectId) {
    return this.notificationsService.markAsRead(notificationId, employeeId)
  }
}
