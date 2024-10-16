import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator'
import { NotificationTypeEnum } from 'src/common/enums/notification-type.enum'

export class CreateNotificationDto {
  @IsEnum(NotificationTypeEnum)
  @IsNotEmpty()
  type!: string

  @IsMongoId()
  @IsOptional()
  objectId?: string

  @IsMongoId()
  @IsOptional()
  ownerId?: string
}
