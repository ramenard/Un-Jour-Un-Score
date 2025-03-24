import {
	Body,
	Controller,
	Post,
	HttpCode,
	HttpStatus,
	Req,
} from '@nestjs/common';
import { SecurityService } from './security.service';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';

export interface RequestWithUserInfo extends Req {
	user: {
		id: string;
		username: string;
		iat: number;
		exp: number;
	};
}

@Controller('security')
export class SecurityController {
	constructor(private readonly securityService: SecurityService) {}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	public signIn(
		@Body() signInDto: SignInDto,
	): Promise<{ access_token: string }> {
		return this.securityService.signIn(signInDto.email, signInDto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('register')
	public register(
		@Body() registerDto: RegisterDto,
	): Promise<{ access_token: string }> {
		return this.securityService.register(registerDto);
	}
}
