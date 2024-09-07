import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { MongooseJsonTransformer } from 'src/common/utils/mongoose-json-transformer'
import { GeneralDataEmbed } from './embed/general-data.schema'

export type ApplicantDocument = Applicant & Document

@Schema()
export class CandidateEmbed {
  @Prop({ type: String, alias: 'photoProfile' })
  photo_profile?: string

  @Prop({ type: Boolean, alias: 'freshGraduate' })
  fresh_graduate?: boolean

  @Prop({ type: String, alias: 'videoResume' })
  video_resume?: string

  @Prop({ type: Number, alias: 'totalExperience' })
  total_experience?: number

  @Prop({ type: Number, alias: 'expectedSalary' })
  expected_salary?: number

  @Prop({ type: Number, alias: 'pointEducation' })
  point_education?: number

  @Prop({ type: String })
  name?: string

  @Prop({ type: String })
  email?: string

  @Prop({ type: String })
  cv?: string

  @Prop({ type: Number })
  age?: number

  @Prop({ type: Number })
  gpa?: number

  @Prop({ type: String })
  gender?: string

  @Prop({ type: GeneralDataEmbed })
  district?: GeneralDataEmbed

  @Prop({ type: GeneralDataEmbed })
  city?: GeneralDataEmbed

  @Prop({ type: GeneralDataEmbed })
  province?: GeneralDataEmbed

  @Prop({ type: String })
  position?: string

  @Prop({ type: Date })
  dob?: Date

  @Prop({ type: GeneralDataEmbed })
  pob?: GeneralDataEmbed

  @Prop({ type: String })
  source?: string
}

@Schema()
export class Degree {
  @Prop({ type: Object })
  name: { en: string; id: string }
}

@Schema()
export class LastEducation {
  @Prop({ type: Degree })
  degree: Degree

  @Prop({ type: String })
  major: string

  @Prop({ type: Number })
  gpa: number

  @Prop({ type: Date, alias: 'startDate' })
  start_date: Date

  @Prop({ type: Date, alias: 'graduateDate' })
  graduate_date: Date

  @Prop({ type: Number, alias: 'pointEducation' })
  point_education: number
}

@Schema()
export class Vacancy {
  @Prop({ type: String })
  name: string
}

@Schema()
export class CandidateMatch {
  @Prop({ type: String, alias: 'requirementType' })
  requirement_type: string

  @Prop({ type: String, alias: 'vacancyData' })
  vacancy_data: string

  @Prop({ type: String, alias: 'candidateData' })
  candidate_data: string

  @Prop({ type: Boolean, alias: 'isMatch' })
  is_match: boolean

  @Prop({ type: Boolean, alias: 'isMandatory' })
  is_mandatory: boolean
}

@Schema({ _id: false })
export class CurrentActivity {
  @Prop({ type: Boolean, alias: 'inReview' })
  in_review: boolean

  @Prop({ type: String, alias: 'applyProcess' })
  apply_process: string

  @Prop({ type: String })
  type: string

  @Prop({ type: String })
  from: string

  @Prop({ type: Date, alias: 'createdAt' })
  created_at: Date

  @Prop({ type: Date, alias: 'updatedAt' })
  updated_at: Date

  @Prop({ type: Date, alias: 'actionAt' })
  action_at: Date
}

@Schema({ toJSON: MongooseJsonTransformer, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Applicant {
  @Prop({ type: GeneralDataEmbed })
  company: GeneralDataEmbed

  @Prop({ type: Vacancy })
  vacancy: Vacancy

  @Prop({ type: CandidateEmbed })
  candidate: CandidateEmbed

  @Prop({ type: [CandidateMatch], alias: 'candidateMatch' })
  candidate_match: CandidateMatch[]

  @Prop({ type: Number, alias: 'matchPercentage' })
  match_percentage: number

  @Prop({ type: CurrentActivity, alias: 'currentActivity' })
  current_activity: CurrentActivity

  @Prop({ type: Boolean })
  is_locked: boolean
}

export const ApplicantSchema = SchemaFactory.createForClass(Applicant)
