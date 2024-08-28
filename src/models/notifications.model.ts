import { getModelForClass, ModelOptions, prop, Severity } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { connection, Schema, Types } from 'mongoose'
import toJSON from '../utils/toJSON'

@ModelOptions({ schemaOptions: { _id: false } })
class ReadedBy {
  @prop({ required: true, alias: 'employeeId', type: Schema.Types.ObjectId }) employee_id!: Types.ObjectId
  @prop({ default: Date.now, alias: 'createdAt' }) created_at!: Date
}

@ModelOptions({
  existingConnection: connection.useDb(process.env.NOTIFICATION_DB || 'bsc_dev_notifications'),
  schemaOptions: {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'notifications',
    toJSON,
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
  @prop({ required: true, default: {}, type: Schema.Types.Mixed }) data!: object
}

const Notification = getModelForClass(NotificationDocument)

export default Notification
