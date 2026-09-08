import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthorRole } from '../../../enums';

export class CreateBookAuthorDto {
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsEnum(AuthorRole)
  @IsOptional()
  role?: AuthorRole;

  @IsInt()
  @IsOptional()
  displayOrder?: number;
}
