import { isValidObjectId } from 'mongoose'

function transformKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(transformKeys)
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
      const newKey = key.replace(/_([a-z])/g, (match) => match[1].toUpperCase())
      newObj[newKey] = transformValue(value)
    }
    return newObj
  }
  return obj
}

function transformValue(value: any): any {
  if (Array.isArray(value)) {
    return value.map(transformKeys)
  } else if (isValidObjectId(value)) {
    return String(value)
  } else if (value instanceof Date) {
    return value.toISOString()
  } else {
    return transformKeys(value)
  }
}

const toJSON = {
  transform(_doc: any, ret: any) {
    ret.oid = ret._id
    delete ret._id
    delete ret.__v
    return transformKeys(ret)
  },
}

export default toJSON
