import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  name: string;

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
