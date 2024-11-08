import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ConnectionNameEnum } from 'src/common/enums/connection-name.enum'
import { NotificationTypeEnum } from 'src/common/enums/notification-type.enum'
import { Applicant, ApplicantDocument } from 'src/schemas/applicant.schema'
import { Employee, EmployeeDocument } from 'src/schemas/employee.schema'
import { Notification, NotificationDocument } from 'src/schemas/notification.schema'
import { CreateNotificationDto } from '../dto/create-notification.dto'

@Injectable()
export class CandidateAppliedService {
  private readonly type = NotificationTypeEnum.CANDIDATE_APPLIED
  private readonly group = 'APPLICANT'

  constructor(
    @InjectModel(Notification.name, ConnectionNameEnum.NOTIFICATION)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(Employee.name, ConnectionNameEnum.EMPLOYEE)
    private readonly employeeModel: Model<EmployeeDocument>,
    @InjectModel(Applicant.name, ConnectionNameEnum.VACANCY)
    private readonly applicantModel: Model<ApplicantDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      this.validateNotification(createNotificationDto)
      const result = await this.generate(createNotificationDto.objectId)
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
      throw new BadRequestException('Applicant ID is required')
    }
  }

  private async generate(objectId: string): Promise<NotificationDocument[]> {
    const applicant = await this.applicantModel.findById(objectId)

    if (!applicant) {
      console.warn(`Applicant with ID ${objectId} not found`)
      throw new NotFoundException(`Applicant with ID ${objectId} not found`)
    }

    const employees = await this.employeeModel.find({ 'company._id': applicant.company._id, deleted_at: { $exists: false } }).exec()

    if (!employees.length) {
      console.warn(`No active employees found for company ID ${applicant.company._id}`)
      throw new NotFoundException('No active employees found')
    }

    const notificationsData = employees.map((employee) => ({
      group: this.group,
      type: this.type,
      name: applicant.candidate.name || '',
      photoUrl: applicant.candidate.photo_profile || '',
      ownerId: employee._id,
      path: `/candidates/management?search=${encodeURIComponent(applicant.candidate.name)}&vacancy=${applicant.vacancy?._id?.toString?.()}|${applicant.vacancy?.name}`,
      message: `${applicant.candidate.name} has applied for a job (${applicant.vacancy.name}).`,
    }))

    const notifications = await Promise.all(notificationsData.map((data) => this.notificationModel.create(data)))

    return notifications
  }
}
