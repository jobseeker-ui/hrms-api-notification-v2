import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { isValidObjectId, Types } from 'mongoose'
import ApiError from '../exceptions/api-error'

export const CompanyId = createParamDecorator((data: unknown, ctx: ExecutionContext): Types.ObjectId => {
  const request = ctx.switchToHttp().getRequest()
  const companyId = request.requestContext ? request.requestContext.authorizer?.company_id : request.headers['company_id']

  if (!isValidObjectId(companyId)) {
    throw new ApiError(400, 'Invalid or missing company ID')
  }

  try {
    return new Types.ObjectId(companyId.toString())
  } catch {
    throw new ApiError(400, 'Invalid company ID format')
  }
})
