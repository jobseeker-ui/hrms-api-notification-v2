import { Transformer } from './transformer'

export const MongooseJsonTransformer = {
  transform(_doc: any, ret: any) {
    ret.oid = ret._id
    delete ret._id
    delete ret.__v
    return Transformer.transformKeys(ret)
  },
}
