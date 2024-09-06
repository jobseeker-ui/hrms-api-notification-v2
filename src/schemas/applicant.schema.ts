import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { MongooseJsonTransformer } from 'src/common/utils/mongoose-json-transformer'
import { GeneralDataEmbed } from './embed/general-data.schema'

export type ApplicantDocument = Applicant & Document

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
  district?: GeneralDataEmbed
  city?: GeneralDataEmbed
  province?: GeneralDataEmbed
  totalExperience?: number
  position?: string
  dob?: Date
  pob?: GeneralDataEmbed
  expectedSalary?: number
  pointEducation?: number
  source?: string
}

@Schema()
export class Degree {
  name: { en: string; id: string }
}

@Schema()
export class LastEducation {
  degree: Degree
  major: string
  gpa: number
  startDate: Date
  graduateDate: Date
  pointEducation: number
}

@Schema()
export class Vacancy {
  name: string
}

@Schema()
export class CandidateMatch {
  requirementType: string
  vacancyData: string
  candidateData: string
  isMatch: boolean
  isMandatory: boolean
}

@Schema()
export class CurrentActivity {
  inReview: boolean
  applyProcess: string
  type: string
  from: string
  createdAt: Date
  updatedAt: Date
  actionAt: Date
}

@Schema({ toJSON: MongooseJsonTransformer, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Applicant {
  company: GeneralDataEmbed
  vacancy: Vacancy
  candidate: CandidateEmbed
  candidateMatch: CandidateMatch[]
  matchPercentage: number
  currentActivity: CurrentActivity
  isLocked: boolean
}

export const ApplicantSchema = SchemaFactory.createForClass(Applicant)
