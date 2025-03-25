import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { SecurityModule } from './security/security.module';
import { GamesModule } from './games/games.module';
import { Game } from './games/entities/game.entity';
import { BadgesModule } from './badges/badges.module';
import { Badge } from './badges/entities/badge.entity';
import { ObtainedBadgesModule } from './obtained-badges/obtained-badges.module';
import { ObtainedBadge } from './obtained-badges/entities/obtained-badge.entity';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';
import { Leaderboard } from './leaderboards/entities/leaderboard.entity';
import { HasPlayedModule } from './has-played/has-played.module';
import { HasPlayed } from './has-played/entities/has-played.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get<string>('MYSQLHOST'),
				port: +configService.get<number>('MYSQLPORT')!,
				username: configService.get<string>('MYSQLUSER'),
				password: configService.get<string>('MYSQL_ROOT_PASSWORD'),
				database: configService.get<string>('MYSQL_DATABASE'),
				url: configService.get<string>('MYSQL_DATABASE_URL'),
				entities: [
					User,
					Game,
					Badge,
					ObtainedBadge,
					Leaderboard,
					HasPlayed,
				],
				autoLoadEntities: true,
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		UsersModule,
		SecurityModule,
		GamesModule,
		BadgesModule,
		ObtainedBadgesModule,
		LeaderboardsModule,
		HasPlayedModule,
		ScheduleModule.forRoot(),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
