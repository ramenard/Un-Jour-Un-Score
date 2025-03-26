import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GamesService } from '../games/games.service';
import { LeaderboardsService } from '../leaderboards/leaderboards.service';

@Injectable()
export class CronService {
	constructor(
		private readonly gameService: GamesService,
		private readonly leaderboardsService: LeaderboardsService,
	) {}

	private isStartGameExecuting = false;
	private isEndGameExecuting = false;

	@Cron('0 30 6 * * *', { name: 'startGame', timeZone: 'Europe/Paris' })
	async handleStartGame() {
		if (this.isStartGameExecuting) {
			Logger.log('Cron job already running, skipping this execution');
			return;
		}

		this.isStartGameExecuting = true;

		try {
			console.log('Cron Job: Starting game...');
			const nextGame = await this.gameService.findNextGame();
			await this.leaderboardsService.create({
				gameId: nextGame.id,
				isClosed: false,
			});
			await this.gameService.update(nextGame.id, {
				isActive: true,
			});
		} catch (error) {
			console.error('Error while executing cron job:', error);
		} finally {
			this.isStartGameExecuting = false;
		}
	}

	@Cron('0 30 21 * * *', { name: 'endGame', timeZone: 'Europe/Paris' })
	async handleEndGame() {
		if (this.isEndGameExecuting) {
			Logger.log(
				'Cron job (endGame) already running, skipping this execution',
			);
			return;
		}

		this.isEndGameExecuting = true;

		try {
			console.log('Cron Job: Ending game...');
			const leaderboardData = await this.leaderboardsService.getCurrent();
			await this.leaderboardsService.update(leaderboardData.id, {
				isClosed: true,
			});
			await this.gameService.update(leaderboardData.game.id, {
				isActive: false,
				lastActiveDate: new Date(),
			});
		} catch (error) {
			console.error('Error while executing endGame cron job:', error);
		} finally {
			this.isEndGameExecuting = false;
		}
	}
}
