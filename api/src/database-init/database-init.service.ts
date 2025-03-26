import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleEnum } from '../users/entities/user.entity';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import { CreateGameDto } from '../games/dto/create-game.dto';
import { LeaderboardsService } from '../leaderboards/leaderboards.service';
import { CreateLeaderboardDto } from '../leaderboards/dto/create-leaderboard.dto';
import { Game } from '../games/entities/game.entity';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
	constructor(
		private readonly gameService: GamesService,
		private readonly userService: UsersService,
		private readonly securityService: SecurityService,
		private readonly leaderboardsService: LeaderboardsService,
	) {}

	async onModuleInit() {
		await this.ensureAdminUser();
		await this.createExistingGames();
	}

	private async ensureAdminUser() {
		const existingAdmin = await this.userService.findAdmin();

		if (!existingAdmin) {
			const adminUser = this.userService.create({
				username: 'admin',
				email: 'admin@email.com',
				password: 'securepassword6!',
				role: RoleEnum.ADMIN,
			});

			await this.securityService.register(await adminUser);
			console.log('Admin user created.');
		} else {
			console.log('Admin user already exists.');
		}
	}

	private async createExistingGames() {
		const coinFlip = await this.gameService.findOneByName('coin-flip');

		const rockPaperScissors = await this.gameService.findOneByName(
			'rock-paper-scissors',
		);

		if (!coinFlip) {
			const addCoinFlip: CreateGameDto = {
				name: 'coin-flip',
				description: 'Notre premier jeu',
				isActive: true,
				isReady: true,
				imagePath: '',
			};
			await this.gameService.create(addCoinFlip);
			console.log('Game Coin-flip created.');

			const coinFlip: Game = await this.gameService.findCurrent();

			const addLeaderboard: CreateLeaderboardDto = {
				gameId: coinFlip.id,
				isClosed: false,
			};
			await this.leaderboardsService.create(addLeaderboard);
			console.log('Leaderboard for Coin-flip created.');
		} else {
			console.log('Game already exists.');
		}

		if (!rockPaperScissors) {
			const addCoinFlip: CreateGameDto = {
				name: 'rock-paper-scissors',
				description: 'Notre second jeu',
				isActive: false,
				isReady: true,
				imagePath: '',
			};

			await this.gameService.create(addCoinFlip);
			console.log('Game RPS created.');
		} else {
			console.log('Game exists.');
		}
	}
}
