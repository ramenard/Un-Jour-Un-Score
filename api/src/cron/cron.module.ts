import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { GamesModule } from '../games/games.module';
import { LeaderboardsModule } from '../leaderboards/leaderboards.module';

@Module({
	imports: [GamesModule, LeaderboardsModule],
	providers: [CronService],
})
export class CronModule {}
