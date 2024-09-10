import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SnsService {
  private readonly snsClient: SNSClient
  private readonly broadcasterTopicArn: string

  constructor(private readonly configService: ConfigService) {
    // Initialize the SNS client with AWS credentials and region
    this.snsClient = new SNSClient()

    // Retrieve the SNS broadcast topic ARN from environment variables
    this.broadcasterTopicArn = this.configService.get<string>('SNS_BROADCAST_TOPIC_ARN')
  }

  /**
   * Publish a message to an SNS topic
   * @param topicArn The ARN of the SNS topic
   * @param message The message to send
   * @param subject Optional subject for the message
   */
  async publishToTopic(topicArn: string, message: string, subject?: string): Promise<void> {
    try {
      const command = new PublishCommand({
        TopicArn: topicArn,
        Message: message,
        Subject: subject,
      })

      const response = await this.snsClient.send(command)
      console.log(`Message sent successfully to topic with MessageId: ${response.MessageId}`)
    } catch (error) {
      console.error('Error sending message to SNS topic', error)
      throw new Error('Failed to send message to SNS topic')
    }
  }

  /**
   * Publish a broadcast message to the broadcaster topic
   * @param message The message to send
   * @param subject Optional subject for the broadcast message
   */
  async publishToBroadcaster(message: string, subject?: string): Promise<void> {
    if (!this.broadcasterTopicArn) {
      console.error('Broadcast topic ARN is not defined in the environment variables')
      throw new Error('Broadcast topic ARN is missing')
    }

    try {
      const command = new PublishCommand({
        TopicArn: this.broadcasterTopicArn,
        Message: message,
        Subject: subject,
      })

      const response = await this.snsClient.send(command)
      console.log(`Broadcast message sent successfully with MessageId: ${response.MessageId}`)
    } catch (error) {
      console.error('Error sending broadcast message to SNS topic', error)
      throw new Error('Failed to send broadcast message to SNS topic')
    }
  }
}
