import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	username?: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsNumber()
	@IsOptional()
	gameCoin?: number;

	@IsNumber()
	@IsOptional()
	premiumCoin?: number;

	@IsNumber()
	@IsOptional()
	freeCoin?: number;
}
