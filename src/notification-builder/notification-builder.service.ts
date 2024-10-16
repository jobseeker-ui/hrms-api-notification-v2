import { Injectable } from '@nestjs/common'
import { SQSEvent, SQSRecord } from 'aws-lambda'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { NotificationTypeEnum } from 'src/common/enums/notification-type.enum'
import { SnsService } from 'src/sns/sns.service'
import { CandidateAppliedService } from './builders/candidate-applied.service'
import { VacancyPublishedService } from './builders/vacancy-published.service'
import { CreateNotificationDto } from './dto/create-notification.dto'

@Injectable()
export class NotificationBuilderService {
  constructor(
    private readonly candidateAppliedService: CandidateAppliedService,
    private readonly vacancyPublishedService: VacancyPublishedService,
    private readonly snsService: SnsService,
  ) {}

  /**
   * Handle incoming SQS event by processing all messages concurrently.
   * @param event - The SQS event containing records to process.
   */
  async handleSQSMessages(event: SQSEvent): Promise<void> {
    try {
      await Promise.all(event.Records.map((record) => this.processMessage(record)))
      console.log('All SQS messages processed successfully')
    } catch (error) {
      console.error('Error processing SQS messages', { error })
      throw new Error('Failed to process some SQS messages')
    }
  }

  /**
   * Process individual SQS record.
   * @param record - The SQS record containing message data.
   */
  private async processMessage(record: SQSRecord): Promise<void> {
    const { messageId, body } = record
    console.log(`Processing message with ID: ${messageId}`)

    try {
      const data = await this.parseAndValidateMessage(body)
      await this.handleNotificationType(data)
    } catch (error) {
      console.error(`Failed to process message with ID: ${messageId}`, { error })
    }
  }

  /**
   * Parse and validate the message body.
   * @param messageBody - The raw message body from the SQS record.
   * @returns A validated CreateNotificationDto instance.
   */
  private async parseAndValidateMessage(messageBody: string): Promise<CreateNotificationDto> {
    try {
      const data = plainToInstance(CreateNotificationDto, JSON.parse(messageBody))
      await validateOrReject(data)
      return data
    } catch (validationErrors) {
      console.error('Message validation failed', { validationErrors, messageBody })
      throw new Error('Invalid message format')
    }
  }

  /**
   * Handle different notification types and generate notifications.
   * @param data - The validated CreateNotificationDto data.
   */
  private async handleNotificationType(data: CreateNotificationDto): Promise<void> {
    const { type, objectId } = data

    console.log(`Handling notification of type: ${type} for object ID: ${objectId}`)

    switch (type) {
      case NotificationTypeEnum.CANDIDATE_APPLIED:
        try {
          const notifications = await this.candidateAppliedService.create(data)

          await Promise.all(
            notifications.map((notification) => this.snsService.publishToBroadcaster(JSON.stringify(notification.toJSON()))),
          )

          console.log(`Notifications published successfully for object ID: ${data.objectId}`)
        } catch (error) {
          error
          console.error('Error generating notifications for CANDIDATE_APPLIED', { data, error })
          throw new Error('Failed to generate notifications')
        }
        break
      case NotificationTypeEnum.VACANCY_PUBLISHED:
        try {
          const notifications = await this.vacancyPublishedService.create(data)

          await Promise.all(
            notifications.map((notification) => this.snsService.publishToBroadcaster(JSON.stringify(notification.toJSON()))),
          )

          console.log(`Notifications published successfully for object ID: ${data.objectId}`)
        } catch (error) {
          console.error('Error generating notifications for CANDIDATE_APPLIED', { data, error })
          throw new Error('Failed to generate notifications')
        }
        break
      default:
        console.warn(`Unsupported notification type: ${type}`)
    }
  }
}
