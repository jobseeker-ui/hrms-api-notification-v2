import { Application, Router } from 'express'
import * as notificationC from '../controllers/notifications.controller'

export const route = Router()

route.get('/', notificationC.getNotifications)
route.patch('/:oid/read', notificationC.getNotifications)
route.delete('/:oid', notificationC.getNotifications)

export const setupNotificationRoute = (app: Application) => {
  app.use('/notifications', route)
}
