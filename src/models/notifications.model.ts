import { getModelForClass, ModelOptions, prop, Severity } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { connection, Schema, Types } from 'mongoose'
import { transformKeys } from '../utils/toJSON'

@ModelOptions({ schemaOptions: { _id: false } })
class ReadedBy {
  @prop({ required: true, alias: 'employeeId', type: Schema.Types.ObjectId }) employee_id!: Types.ObjectId
  @prop({ default: Date.now, alias: 'createdAt' }) created_at!: Date
}

@ModelOptions({
  existingConnection: connection.useDb(process.env.DB_NOTIFICATION || 'bsc_dev_notification'),
  schemaOptions: {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'notifications',
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.oid = ret._id
        ret.employee_ids = ret.employee_ids.map((el: any) => el.toString())
        delete ret._id
        delete ret.__v
        return transformKeys(ret)
      },
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class NotificationDocument extends TimeStamps {
  @prop({ required: true, alias: 'companyId' }) company_id!: string
  @prop({ required: true, alias: 'employeeIds', type: [Schema.Types.ObjectId] }) employee_ids!: Types.ObjectId[]
  @prop({ required: true, alias: 'deletedByEmployeeIds', default: [], type: [Schema.Types.ObjectId] })
  deleted_by_employee_ids!: Types.ObjectId[]
  @prop({ required: true, alias: 'readedBy', default: [], type: ReadedBy }) readed_by!: ReadedBy[]

  @prop({ required: true }) type!: string
  @prop({ required: true }) path!: string
  @prop({ required: true }) message!: string
  @prop({ required: true }) name!: string

  @prop({ alias: 'photoUrl' }) photo_url?: string
}

const Notification = getModelForClass(NotificationDocument)

export default Notification
