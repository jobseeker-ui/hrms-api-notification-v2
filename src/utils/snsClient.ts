import { SNSClient } from '@aws-sdk/client-sns'

export const snsClient = new SNSClient({
  region: process.env.AWS_REGION || process.env.JSC_REGION || 'ap-southeast-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.JSC_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.JSC_SECRET_ACCESS_KEY || '',
  },
})
