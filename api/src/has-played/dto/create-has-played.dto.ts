import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateHasPlayedDto {
  @IsUUID()
  @IsNotEmpty()
  leaderboardId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  tries?: number;

  @IsOptional()
  @IsNumber()
  position?: number;
}
