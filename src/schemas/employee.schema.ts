import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { MongooseJsonTransformer } from 'src/common/utils/mongoose-json-transformer'
import { GeneralDataEmbed } from './embed/general-data.schema'

export type EmployeeDocument = Document & Employee

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
  @Prop({ alias: 'photoProfile' })
  photo_profile?: {
    thumbnail: { link: string; mime_type: string }
    link: string
    mime_type: string
  }
  @Prop({ alias: 'deletedAt' })
  deleted_at?: Date
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)
