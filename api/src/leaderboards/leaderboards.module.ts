import { Module } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';
import { LeaderboardsController } from './leaderboards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { GamesModule } from '../games/games.module';

@Module({
	imports: [TypeOrmModule.forFeature([Leaderboard]), GamesModule],
	controllers: [LeaderboardsController],
	providers: [LeaderboardsService],
	exports: [LeaderboardsService],
})
export class LeaderboardsModule {}
