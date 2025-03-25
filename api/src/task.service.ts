import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
	private readonly logger = new Logger(TasksService.name);

	@Cron('0 21 * * *')
	handleCronEndGame() {
		this.logger.debug('Called when the current second is 45');
	}

	@Cron('0 6 * * *')
	handleCronStartGame() {
		this.logger.debug('Called when the current second is 45');
	}
}
