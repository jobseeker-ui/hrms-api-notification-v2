import 'reflect-metadata'

import { SQSHandler } from 'aws-lambda'
import Application from '../app'
import * as notificationService from '../services/notification.service'
import parseMongoId from '../utils/parseMongoId'

let app: Application

app = new Application()

export const handler: SQSHandler = async (event) => {
  if (!app) app = new Application()

  for (const record of event.Records) {
    try {
      const companyId = parseMongoId(record.messageAttributes.companyId.stringValue)
      const type = record.messageAttributes.type.stringValue
      const data = JSON.parse(record.body)
      if (!type) throw new Error('Missing required attributes')

      await notificationService.createNotification({ companyId, type, data })

      // publish notification with web socket
    } catch (error) {
      console.error('Error processing record', error)
    }
  }
}
