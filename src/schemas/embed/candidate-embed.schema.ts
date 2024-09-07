import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { GeneralDataEmbed } from './general-data.schema'

export type CandidateEmbedDocument = CandidateEmbed & Document

@Schema()
export class CandidateEmbed {
  @Prop()
  name?: string

  @Prop()
  email?: string

  @Prop({ alias: 'photoProfile' })
  photo_profile?: string

  @Prop({ alias: 'freshGraduate' })
  fresh_graduate?: boolean

  @Prop({ alias: 'videoResume' })
  video_resume?: string

  @Prop()
  cv?: string

  @Prop()
  age?: number

  @Prop()
  gpa?: number

  @Prop()
  gender?: string

  @Prop({ type: GeneralDataEmbed })
  district?: GeneralDataEmbed

  @Prop({ type: GeneralDataEmbed })
  city?: GeneralDataEmbed

  @Prop({ type: GeneralDataEmbed })
  province?: GeneralDataEmbed

  @Prop({ alias: 'totalExperience' })
  total_experience?: number

  @Prop()
  position?: string

  @Prop()
  dob?: Date

  @Prop({ type: GeneralDataEmbed })
  pob?: GeneralDataEmbed

  @Prop({ alias: 'expectedSalary' })
  expected_salary?: number

  @Prop({ alias: 'pointEducation' })
  point_education?: number

  @Prop()
  source?: string
}

export const CandidateEmbedSchema = SchemaFactory.createForClass(CandidateEmbed)
