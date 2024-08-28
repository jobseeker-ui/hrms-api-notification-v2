import { FilterQuery, Types } from 'mongoose'
import Employee from '../models/employees.model'
import Notification, { NotificationDocument } from '../models/notifications.model'

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

export const createNotification = async ({
  companyId,
  type,
  data,
}: {
  companyId: Types.ObjectId
  type: string
  data: Record<string, any>
}) => {
  const employees = await Employee.find({ 'company._id': companyId, status: 'ACTIVE', deleted_at: null })
  const employeeIds = employees.map((employee) => employee._id)

  const notification = await Notification.create({
    company_id: companyId,
    employee_ids: employeeIds,
    type,
    data,
  })

  return notification
}
