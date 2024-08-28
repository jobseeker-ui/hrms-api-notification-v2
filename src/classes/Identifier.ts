import { Request } from 'express'
import { Types } from 'mongoose'
import ApiError from './ApiError'

export class Identifier {
  static getCompanyId(req: Request): Types.ObjectId {
    const companyId = req.requestContext ? req.requestContext.authorizer?.company_id : req.headers['company_id']

    if (!companyId || Array.isArray(companyId)) {
      throw new ApiError(400, 'Invalid or missing company ID')
    }

    try {
      return new Types.ObjectId(companyId.toString())
    } catch {
      throw new ApiError(400, 'Invalid company ID format')
    }
  }

  static getEmployeeId(req: Request): Types.ObjectId {
    const employeeId = req.requestContext ? req.requestContext.authorizer?.employee_id : req.headers['employee_id']

    if (!employeeId || Array.isArray(employeeId)) {
      throw new ApiError(400, 'Invalid or missing employee ID')
    }

    try {
      return new Types.ObjectId(employeeId.toString())
    } catch {
      throw new ApiError(400, 'Invalid employee ID format')
    }
  }
}
