import { Injectable, OnModuleInit } from '@nestjs/common';
import {RoleEnum, User} from '../users/entities/user.entity';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import { CreateGameDto } from '../games/dto/create-game.dto';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
	constructor(
		private readonly gameService: GamesService,
		private readonly userService: UsersService,
		private readonly securityService: SecurityService,
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
