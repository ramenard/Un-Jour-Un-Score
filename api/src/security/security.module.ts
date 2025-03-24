import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '3h' },
		}),
	],
	providers: [SecurityService],
	controllers: [SecurityController],
})
export class SecurityModule {}
