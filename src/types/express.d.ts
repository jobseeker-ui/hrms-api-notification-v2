declare namespace Express {
  export interface Response {
    success: (data: any, message?: string) => void
  }

  export interface Request {
    requestContext?: {
      stage?: string
      authorizer?: {
        user_email?: string
        company_id?: string
        user_name?: string
        company_name?: string
        employee_id?: string
        principalId?: string
        integrationLatency?: number
      }
    }
  }
}
