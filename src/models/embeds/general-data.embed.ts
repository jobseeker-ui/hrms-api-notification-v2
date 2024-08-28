import { ModelOptions, prop } from '@typegoose/typegoose'
import { Schema, Types } from 'mongoose'

@ModelOptions({ schemaOptions: { _id: false } })
class GeneralDataEmbed {
  @prop({ required: true, alias: 'oid', type: Schema.Types.ObjectId }) _id!: Types.ObjectId
  @prop() name?: string
}

export default GeneralDataEmbed
