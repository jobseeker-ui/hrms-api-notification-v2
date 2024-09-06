import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { MongooseJsonTransformer } from 'src/common/utils/mongoose-json-transformer'

export type NotificationDocument = HydratedDocument<Notification>

@Schema({ toJSON: MongooseJsonTransformer })
export class Notification {
  @Prop({ required: true, alias: 'ownerId', type: Types.ObjectId })
  owner_id!: Types.ObjectId

  @Prop({ required: true })
  group!: string

  @Prop({ required: true })
  type!: string

  @Prop({ required: true })
  name!: string

  @Prop({ alias: 'photoUrl' })
  photo_url?: string

  @Prop({ required: true })
  path!: string

  @Prop({ required: true })
  message!: string

  @Prop({ alias: 'deletedAt' })
  deleted_at?: Date

  @Prop({ alias: 'readAt' })
  read_at?: Date
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)

NotificationSchema.index({ owner_id: 1 })
NotificationSchema.index({ group: 1 })
NotificationSchema.index({ type: 1 })
NotificationSchema.index({ deleted_at: 1 })
