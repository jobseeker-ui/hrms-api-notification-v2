import 'reflect-metadata'

import { SQSHandler } from 'aws-lambda'

console.log('record, body', {
  Type: 'Notification',
  MessageId: 'b448c08c-5cc1-5fc6-8a07-9fc4e0afcf62',
  TopicArn: 'arn:aws:sns:ap-southeast-3:730335295088:notification-topic',
  Subject: 'CompanyNotification',
  Message: '{\n  "hallo": "World!"\n}',
  Timestamp: '2024-08-28T05:48:30.370Z',
  SignatureVersion: '1',
  Signature:
    'GAkIameiITaWp4BneLYZzYfe5W8SWhTFR3iWz1399ZE+JnwNtgQihWc0RYD9a+H/GOXnRgyxs8YLY/lP4TCc4CWeLGajbdWAvjWyl9OOLy9fBsWSeyLacg//94xcCmTfVvb2aZYk9MU0SlWJRVQOUV1esmTguzqhoXJFNsE3gN34I9Yyfa6fEsS/hY8gybPPzB1MGkYjYYyQEa1pIPVx4Cl6LjUvjDJGmtCi+o+kT6ZacRxFxMFOuW+AcGwTUazuviuaRWc8mH6GKjuvXr+q7HVfDbwcPUlPwGcJhajTCBQoATFLccCHZ9lmyDX8+HTwUKx3X1RYVrRBH+H6AZMG+Q==',
  SigningCertURL: 'https://sns.ap-southeast-3.amazonaws.com/SimpleNotificationService-53c5d30febf95c0a5063d2c7948f669e.pem',
  UnsubscribeURL:
    'https://sns.ap-southeast-3.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-southeast-3:730335295088:notification-topic:1a0102d5-8f26-4ab9-b102-dd05258892cf',
})

export const handler: SQSHandler = async (event, context) => {
  console.log('EVENT', event)
  console.log('CONTEXT', context)
  for (const record of event.Records) {
    try {
      console.log(record)
    } catch (error) {
      console.error('Error processing record', error)
    }
  }
}
