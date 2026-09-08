import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PublishingStatus } from '../../../enums';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  slug: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deathDate?: Date;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nationality?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  gender?: string;

  @IsString()
  @IsOptional()
  awards?: string;

  @IsObject()
  @IsOptional()
  socialLinks?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  source?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  sourceAuthorId?: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  importedAt?: Date;

  @IsEnum(PublishingStatus)
  @IsOptional()
  status?: PublishingStatus;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
