import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { GeneralDataDocument } from './general-data.schema'

export type CandidateEmbedDocument = CandidateEmbed & Document

@Schema()
export class CandidateEmbed {
  name?: string
  email?: string
  photoProfile?: string
  freshGraduate?: boolean
  videoResume?: string
  cv?: string
  age?: number
  gpa?: number
  gender?: string
  district?: GeneralDataDocument
  city?: GeneralDataDocument
  province?: GeneralDataDocument
  totalExperience?: number
  position?: string
  dob?: Date
  pob?: GeneralDataDocument
  expectedSalary?: number
  pointEducation?: number
  source?: string
}

export const CandidateEmbedSchema = SchemaFactory.createForClass(CandidateEmbed)
