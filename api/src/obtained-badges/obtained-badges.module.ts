import { Module } from '@nestjs/common';
import { ObtainedBadgesService } from './obtained-badges.service';
import { ObtainedBadgesController } from './obtained-badges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObtainedBadge } from './entities/obtained-badge.entity';
import { UsersModule } from '../users/users.module';
import { BadgesModule } from '../badges/badges.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ObtainedBadge]),
		UsersModule,
		BadgesModule,
	],
	controllers: [ObtainedBadgesController],
	providers: [ObtainedBadgesService],
})
export class ObtainedBadgesModule {}
