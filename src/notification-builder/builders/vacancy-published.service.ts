import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ConnectionNameEnum } from 'src/common/enums/connection-name.enum'
import { NotificationTypeEnum } from 'src/common/enums/notification-type.enum'
import { Employee, EmployeeDocument } from 'src/schemas/employee.schema'
import { Notification, NotificationDocument } from 'src/schemas/notification.schema'
import { Vacancy, VacancyDocument } from 'src/schemas/vacancy.schema'
import { CreateNotificationDto } from '../dto/create-notification.dto'

@Injectable()
export class VacancyPublishedService {
  private readonly type = NotificationTypeEnum.VACANCY_PUBLISHED
  private readonly group = 'VACANCY'

  constructor(
    @InjectModel(Notification.name, ConnectionNameEnum.NOTIFICATION)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(Employee.name, ConnectionNameEnum.EMPLOYEE)
    private readonly employeeModel: Model<EmployeeDocument>,
    @InjectModel(Vacancy.name, ConnectionNameEnum.VACANCY)
    private readonly vacancyModel: Model<VacancyDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      this.validateNotification(createNotificationDto)
      const result = await this.generate(createNotificationDto)
      return result
    } catch (error) {
      console.error('Failed to create notification', { error, createNotificationDto })
      throw error
    }
  }

  private validateNotification({ type, objectId }: CreateNotificationDto): void {
    if (type !== this.type) {
      throw new BadRequestException(`Invalid notification type: ${type}`)
    }

    if (!objectId) {
      throw new BadRequestException('Object ID is required')
    }
  }

  private async generate({ objectId }: CreateNotificationDto): Promise<NotificationDocument[]> {
    const vacancy = await this.vacancyModel.findById(objectId)

    if (!vacancy) {
      console.warn(`Vacancy with ID ${objectId} not found`)
      throw new NotFoundException(`Vacancy with ID ${objectId} not found`)
    }

    if (!vacancy.employee) {
      console.warn(`Vacancy with ID ${objectId} has no employee`)
      throw new NotFoundException(`Vacancy with ID ${objectId} has no employee`)
    }

    const employees = await this.employeeModel.find({ 'company._id': vacancy.company._id, deleted_at: { $exists: false } }).exec()

    if (!employees.length) {
      console.warn(`No active employees found for company ID ${vacancy.company._id}`)
      throw new NotFoundException('No active employees found')
    }

    const notificationsData = employees.map((employee) => {
      const { name, photo_profile } = vacancy.employee
      const vacancyName = vacancy.vacancy_name || 'a job vacancy'
      const vacancyType = vacancy.rr_number ? 'requisition' : 'management'

      return {
        group: this.group,
        type: this.type,
        name: name || 'An employee',
        photoUrl: photo_profile?.thumbnail?.link || '',
        ownerId: employee._id,
        path: `/job/${vacancyType}/${vacancy._id}`,
        message: `${name || 'An employee'} has posted a new job vacancy (${vacancyName}).`,
      }
    })

    const notifications = await Promise.all(notificationsData.map((data) => this.notificationModel.create(data)))

    return notifications
  }
}
