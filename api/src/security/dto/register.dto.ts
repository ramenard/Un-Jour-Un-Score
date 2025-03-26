import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { RoleEnum } from '../../users/entities/user.entity';

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsEnum(RoleEnum)
	@IsOptional()
	role: RoleEnum;
}
