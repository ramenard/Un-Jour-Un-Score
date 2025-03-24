import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBadgeDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	imagePath?: string;
}
