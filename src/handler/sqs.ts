import 'reflect-metadata'

import { SQSHandler } from 'aws-lambda'
import Application from '../app'
import * as notificationService from '../services/notification.service'

let app: Application

app = new Application()

export const handler: SQSHandler = async (event) => {
  if (!app) app = new Application()

  for (const record of event.Records) {
    try {
      const data = JSON.parse(record.body)

      await notificationService.createNotification(data)

      // publish notification with web socket
    } catch (error) {
      console.error('Error processing record', error)
    }
  }
}
