import { Controller, Post, UseGuards } from '@nestjs/common';
import { CronService } from './cron.service';
import { SecurityGuard } from '../security/security.guard';

@UseGuards(SecurityGuard)
@Controller('cron')
export class CronController {
	constructor(private readonly cronService: CronService) {}

	@Post('end-game')
	public endGame(): Promise<void> {
		return this.cronService.handleEndGame();
	}

	@Post('start-game')
	public startGame(): Promise<void> {
		return this.cronService.handleStartGame();
	}
}