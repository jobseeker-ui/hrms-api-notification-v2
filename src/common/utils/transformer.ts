import { isValidObjectId } from 'mongoose'

export class Transformer {
  static transformKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(Transformer.transformKeys)
    } else if (obj !== null && typeof obj === 'object') {
      const newObj: Record<string, any> = {}
      for (const [key, value] of Object.entries(obj)) {
        let nKey: string
        if (key === '_id') nKey = 'oid'
        else nKey = key.replace(/_([a-z])/g, (match) => match[1].toUpperCase())
        newObj[nKey] = Transformer.transformValue(value)
      }
      return newObj
    }
    return obj
  }

  static transformValue(value: any): any {
    if (Array.isArray(value)) {
      return value.map(Transformer.transformKeys)
    } else if (isValidObjectId(value)) {
      return String(value)
    } else if (value instanceof Date) {
      return value.toISOString()
    } else {
      return Transformer.transformKeys(value)
    }
  }
}
