import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ConnectionNameEnum } from 'src/common/enums/connection-name.enum'
import { NotificationGroupEnum } from 'src/common/enums/notification-group.enum'
import { NotificationTypeEnum } from 'src/common/enums/notification-type.enum'
import { Applicant, ApplicantDocument } from 'src/schemas/applicant.schema'
import { Employee, EmployeeDocument } from 'src/schemas/employee.schema'
import { Notification, NotificationDocument } from 'src/schemas/notification.schema'
import { CreateNotificationDto } from '../dto/create-notification.dto'

@Injectable()
export class CandidateAppliedService {
  private readonly type = NotificationTypeEnum.CANDIDATE_APPLIED
  private readonly group = NotificationGroupEnum.APPLICANT
  private readonly logger = new Logger(CandidateAppliedService.name)

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
      const result = await this.generate(createNotificationDto.applicantId)
      return result
    } catch (error) {
      this.logger.error('Failed to create notification', { error, createNotificationDto })
      throw error
    }
  }

  private validateNotification({ type, applicantId }: CreateNotificationDto): void {
    if (type !== this.type) {
      throw new BadRequestException(`Invalid notification type: ${type}`)
    }

    if (!applicantId) {
      throw new BadRequestException('Applicant ID is required')
    }
  }

  private async generate(applicantId: string): Promise<NotificationDocument[]> {
    const applicant = await this.applicantModel.findById(applicantId)

    if (!applicant) {
      this.logger.warn(`Applicant with ID ${applicantId} not found`)
      throw new NotFoundException(`Applicant with ID ${applicantId} not found`)
    }

    const employees = await this.employeeModel.find({ 'company._id': applicant.company._id, deleted_at: { $exists: false } }).exec()

    if (!employees.length) {
      this.logger.warn(`No active employees found for company ID ${applicant.company._id}`)
      throw new NotFoundException('No active employees found')
    }

    const notificationsData = employees.map((employee) => ({
      group: this.group,
      type: this.type,
      name: applicant.candidate.name || '',
      photoUrl: applicant.candidate.photo_profile || '',
      ownerId: employee._id,
      path: `/candidates/management?search=${encodeURIComponent(applicant.candidate.name)}`,
      message: `${applicant.candidate.name} has applied for a job (${applicant.vacancy.name}).`,
    }))

    const notifications = await Promise.all(notificationsData.map((data) => this.notificationModel.create(data)))

    return notifications
  }
}
