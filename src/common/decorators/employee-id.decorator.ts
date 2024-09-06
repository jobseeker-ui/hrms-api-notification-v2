import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { isValidObjectId, Types } from 'mongoose'
import ApiError from '../exceptions/api-error'

export const EmployeeId = createParamDecorator((data: unknown, ctx: ExecutionContext): Types.ObjectId => {
  const request = ctx.switchToHttp().getRequest()
  const employeeId = request.requestContext ? request.requestContext.authorizer?.employee_id : request.headers['employee_id']

  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, 'Invalid or missing employee ID')
  }

  try {
    return new Types.ObjectId(employeeId.toString())
  } catch {
    throw new ApiError(400, 'Invalid employee ID format')
  }
})
