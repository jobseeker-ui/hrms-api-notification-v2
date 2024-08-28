import { Identifier } from '../classes/Identifier'
import * as notificationService from '../services/notification.service'
import ca from '../utils/catchAsync'
import parseMongoId from '../utils/parseMongoId'

export const getNotifications = ca(async (req, res) => {
  const companyId = Identifier.getCompanyId(req)
  const employeeId = Identifier.getEmployeeId(req)

  let page = parseInt(req.query.page?.toString() || '1')
  let size = parseInt(req.query.limit?.toString() || '20')

  const type = req.query.type?.toString()

  if (isNaN(page) || page < 1) page = 1
  if (isNaN(size) || size < 1) size = 20
  if (size > 100) size = 100

  const notifications = await notificationService.paginate({ companyId, employeeId, page, size, type })

  res.success(notifications)
})

export const markNotificationAsRead = ca(async (req, res) => {
  const companyId = Identifier.getCompanyId(req)
  const employeeId = Identifier.getEmployeeId(req)
  const notificationId = parseMongoId(req.params.oid)

  const notification = await notificationService.markAsRead({ companyId, employeeId, notificationId })

  res.success(notification)
})

export const destroyNotification = ca(async (req, res) => {
  const companyId = Identifier.getCompanyId(req)
  const employeeId = Identifier.getEmployeeId(req)
  const notificationId = parseMongoId(req.params.oid)

  await notificationService.destroy({ companyId, employeeId, notificationId })

  res.success(null)
})
