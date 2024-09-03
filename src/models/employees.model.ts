import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { connection } from 'mongoose'
import toJSON from '../utils/toJSON'
import GeneralDataEmbed from './embeds/general-data.embed'

class Company extends GeneralDataEmbed {
  @prop() code?: string
}

@ModelOptions({
  existingConnection: connection.useDb(process.env.DB_EMPLOYEE || 'bsc_dev_employee'),
  schemaOptions: {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'employees',
    toJSON,
  },
})
class EmployeeDocument extends TimeStamps {
  @prop() name?: string
  @prop() email?: string
  @prop({ type: Company }) company?: Company
  @prop() status?: string
  @prop() employee_code?: string
  @prop({ alias: 'deletedAt', type: Date }) deleted_at?: Date
}

const Employee = getModelForClass(EmployeeDocument)

export default Employee
