import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isReady?: boolean;

  @IsOptional()
  @IsString()
  imagePath?: string;
}
