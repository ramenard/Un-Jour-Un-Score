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
	gameCoins?: number;

	@IsNumber()
	@IsOptional()
	premiumCoins?: number;

	@IsNumber()
	@IsOptional()
	freeCoins?: number;
}
