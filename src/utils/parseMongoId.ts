import { isValidObjectId, Types } from 'mongoose'
import ApiError from '../classes/ApiError'

export default function parseMongoId(oid?: string | null) {
  if (!isValidObjectId(oid)) throw new ApiError(400, 'Invalid company ID format')
  try {
    return new Types.ObjectId(String(oid))
  } catch {
    throw new ApiError(400, 'Invalid company ID format')
  }
}
