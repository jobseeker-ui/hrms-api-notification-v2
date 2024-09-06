import { Types } from 'mongoose'

declare module 'fastify' {
  interface FastifyRequest {
    requestContext?: {
      stage?: string
      authorizer?: {
        user_email?: string
        company_id?: string | Types.ObjectId
        user_name?: string
        company_name?: string
        employee_id?: string | Types.ObjectId
        principalId?: string
        integrationLatency?: number
      }
    }
  }

  interface FastifyReply {
    success: (data: any, message?: string) => void
  }
}
