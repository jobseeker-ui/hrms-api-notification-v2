import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { MongooseJsonTransformer } from 'src/common/utils/mongoose-json-transformer'
import { GeneralDataEmbed } from './embed/general-data.schema'

export type EmployeeDocument = Document & Employee

@Schema()
export class PhotoProfile {
  @Prop({ required: true, type: Object })
  thumbnail?: {
    link?: string
    mime_type?: string
  }

  @Prop({ required: true })
  link?: string

  @Prop({ required: true })
  mime_type?: string
}

@Schema({ toJSON: MongooseJsonTransformer, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Employee {
  @Prop()
  name?: string

  @Prop()
  email?: string

  @Prop()
  company?: GeneralDataEmbed

  @Prop()
  status?: string

  @Prop({ alias: 'employeeCode' })
  employee_code?: string

  @Prop({ type: PhotoProfile, alias: 'photoProfile' })
  photo_profile?: PhotoProfile

  @Prop({ alias: 'deletedAt' })
  deleted_at?: Date
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)
