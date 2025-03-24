import { IsNumber, IsOptional } from 'class-validator';

export class UpdateHasPlayedDto {
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
