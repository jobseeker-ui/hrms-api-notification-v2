import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type GeneralDataDocument = Document & GeneralDataEmbed

@Schema()
export class GeneralDataEmbed {
  _id: Types.ObjectId
  @Prop()
  name?: string
}

export const GeneralDataSchema = SchemaFactory.createForClass(GeneralDataEmbed)
