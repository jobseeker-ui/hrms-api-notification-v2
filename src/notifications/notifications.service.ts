import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { ConnectionNameEnum } from 'src/common/enums/connection-name.enum'
import { Applicant, ApplicantDocument } from 'src/schemas/applicant.schema'
import { Employee, EmployeeDocument } from 'src/schemas/employee.schema'
import { Notification, NotificationDocument } from '../schemas/notification.schema'
import { PaginateNotificationsDto } from './dto/paginate-notifications.dto'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name, ConnectionNameEnum.NOTIFICATION)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(Employee.name, ConnectionNameEnum.EMPLOYEE)
    private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Applicant.name, ConnectionNameEnum.VACANCY)
    private applicantModel: Model<ApplicantDocument>,
  ) {}

  async paginate(ownerId: Types.ObjectId, paginateNotificationsDto: PaginateNotificationsDto) {
    const { skip = 0, limit = 20, sortDirection = 'DESC', sortedField = 'createdAt', group } = paginateNotificationsDto

    const query: FilterQuery<NotificationDocument> = {
      owner_id: ownerId,
      deleted_at: { $exists: false },
      group,
    }

    const totalElements = await this.notificationModel.countDocuments(query).exec()
    const notifications = await this.notificationModel
      .find(query)
      .sort({ [sortedField]: sortDirection === 'ASC' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec()

    const totalPages = Math.ceil(totalElements / limit)

    return {
      items: notifications,
      totalElements,
      totalPages,
    }
  }

  async getTotalNotificationsGroupedByGroup(ownerId: Types.ObjectId) {
    const result = await this.notificationModel.aggregate([
      {
        $match: {
          owner_id: ownerId,
          deleted_at: { $exists: false },
        },
      },
      {
        $group: {
          _id: '$group',
          totalCount: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: {
                if: { $eq: ['$read_at', null] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
    ])

    return result
  }

  async markAsRead(ownerId: Types.ObjectId, notificationId: Types.ObjectId) {
    const result = await this.notificationModel.updateOne(
      { _id: notificationId, owner_id: ownerId, deleted_at: { $exists: false } },
      { $set: { read_at: new Date() } },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException('Notification not found or already marked as read')
    }

    const updatedNotification = await this.notificationModel.findOne({ _id: notificationId }).exec()
    if (!updatedNotification) {
      throw new NotFoundException('Notification not found')
    }

    return updatedNotification
  }

  async markAllAsRead(ownerId: Types.ObjectId, group: string) {
    const result = await this.notificationModel.updateMany(
      { owner_id: ownerId, group, read_at: { $exists: false }, deleted_at: { $exists: false } },
      { $set: { read_at: new Date() } },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException('No notifications found to mark as read')
    }

    return result.modifiedCount
  }
}
