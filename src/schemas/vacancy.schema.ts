import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { MongooseJsonTransformer } from 'src/common/utils/mongoose-json-transformer'
import { GeneralDataEmbed } from './embed/general-data.schema'
import { Employee } from './employee.schema'

export type VacancyDocument = HydratedDocument<Vacancy>

@Schema({ toJSON: MongooseJsonTransformer, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Vacancy {
  @Prop({ alias: 'vacancyName' })
  vacancy_name?: string

  @Prop({ alias: 'rrNumber' })
  rr_number!: string

  @Prop()
  employee?: Employee

  @Prop({ type: GeneralDataEmbed })
  company: GeneralDataEmbed

  @Prop({ alias: 'deletedAt' })
  deleted_at?: Date
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy)
