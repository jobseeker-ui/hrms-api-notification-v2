import { PublishCommand } from '@aws-sdk/client-sns'
import { FilterQuery, Types } from 'mongoose'
import { logger } from '../config/logger'
import Employee from '../models/employees.model'
import Notification, { NotificationDocument } from '../models/notifications.model'
import parseMongoId from '../utils/parseMongoId'
import { snsClient } from '../utils/snsClient'

export const paginate = async ({
  companyId,
  employeeId,
  type,
  page = 1,
  size = 20,
}: {
  companyId: Types.ObjectId
  employeeId: Types.ObjectId
  page?: number
  size?: number
  type?: string
}) => {
  const skip = page * size

  const query: FilterQuery<NotificationDocument> = {
    company_id: companyId,
    employee_ids: { $in: employeeId },
    deleted_by_employee_ids: { $ne: employeeId },
  }

  if (type) query.type = type

  const totalElements = await Notification.countDocuments(query)
  const notifications = await Notification.find(query).skip(skip).limit(size)
  const totalPages = Math.ceil(totalElements / size)

  return {
    content: notifications,
    pageable: {
      pageNumber: page,
      pageSize: size,
      sort: null,
      offset: skip,
      paged: true,
      unpaged: false,
    },
    totalPages,
    totalElements,
    last: page >= totalPages,
    size,
    number: page,
    sort: null,
    numberOfElements: notifications.length,
    first: page <= 1,
    empty: notifications.length === 0,
  }
}

export const markAsRead = async ({
  companyId,
  employeeId,
  notificationId,
}: {
  companyId: Types.ObjectId
  employeeId: Types.ObjectId
  notificationId: Types.ObjectId
}) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      company_id: companyId,
      employee_ids: { $in: employeeId },
      readed_by: { $ne: { employeeId } },
    },
    {
      $addToSet: { readed_by: employeeId },
    },
    {
      new: true,
    },
  )

  return notification
}

export const destroy = async ({
  companyId,
  employeeId,
  notificationId,
}: {
  companyId: Types.ObjectId
  employeeId: Types.ObjectId
  notificationId: Types.ObjectId
}) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      company_id: companyId,
      employee_ids: { $in: employeeId },
      deleted_by_employee_ids: { $ne: employeeId },
    },
    {
      $addToSet: { deleted_by_employee_ids: employeeId },
    },
    {
      new: true,
    },
  )

  return notification
}

export const createNotification = async (data: Record<string, any>) => {
  const companyId = parseMongoId(data.companyId)
  const type = data.type?.toString()
  const photoUrl = data.photoUrl?.toString()
  const name = data.name?.toString()
  const message = data.message?.toString()
  const path = data.path?.toString()

  if (!type || !companyId || !photoUrl || !name || !message || !path) {
    throw new Error('Missing required fields')
  }

  const employees = await Employee.find({ 'company._id': companyId, status: 'ACTIVE', deleted_at: null })
  const employeeIds = employees.map((employee) => employee._id.toHexString())

  const notification = await Notification.create({
    company_id: companyId,
    employee_ids: employeeIds,
    type,
    photoUrl,
    name,
    message,
    path,
  })

  try {
    // Publish notification to SNS topic
    logger.info('Publishing notification to SNS topic')
    const res = await snsClient.send(
      new PublishCommand({
        TopicArn: process.env.SNS_BROADCAST_TOPIC_ARN,
        Message: JSON.stringify({ notification: { ...notification.toJSON(), employeeIds }, subject: 'COMPANY_NOTIFICATION' }),
      }),
    )
    logger.info('Notification published', res)
  } catch (error) {
    logger.error('Error publishing notification', error)
  }

  return notification
}
