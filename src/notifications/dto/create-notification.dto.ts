import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class CreateNotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  ownerId!: Types.ObjectId

  @IsString()
  @IsNotEmpty()
  group!: string

  @IsString()
  @IsNotEmpty()
  type!: string

  @IsString()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsString()
  photoUrl?: string

  @IsString()
  @IsNotEmpty()
  path!: string

  @IsString()
  @IsNotEmpty()
  message!: string
}
