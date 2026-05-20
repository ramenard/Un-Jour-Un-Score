import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { GamesModule } from '../games/games.module';
import { LeaderboardsModule } from '../leaderboards/leaderboards.module';

@Module({
	imports: [GamesModule, LeaderboardsModule],
	controllers: [CronController],
	providers: [CronService],
})
export class CronModule {}
