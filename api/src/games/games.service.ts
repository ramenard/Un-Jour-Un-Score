import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
	public constructor(
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
	) {}

	public async create(createGameDto: CreateGameDto): Promise<void> {
		await this.gameRepository.save(createGameDto);
	}

	public findAll(): Promise<Game[]> {
		return this.gameRepository.find({ relations: ['leaderboards'] });
	}

	public async findOne(id: string): Promise<Game> {
		const game = await this.gameRepository.findOne({
			where: { id: id },
			relations: ['leaderboards'],
		});
		if (!game) {
			throw new NotFoundException();
		}

		return game;
	}

	public async findOneByName(name: string): Promise<Game | null> {
		return await this.gameRepository.findOne({
			where: { name: name },
		});
	}

	public async findCurrent(): Promise<Game> {
		const game = await this.gameRepository.findOne({
			where: { isActive: true },
		});
		if (!game) {
			throw new NotFoundException();
		}
		return game;
	}

	public async update(
		id: string,
		updateGameDto: UpdateGameDto,
	): Promise<Game> {
		await this.gameRepository.update(id, updateGameDto);

		return this.findOne(id);
	}

	public async remove(id: string): Promise<void> {
		await this.gameRepository.delete(id);
	}

	public async findNextGame(): Promise<Game> {
		let game: Game | null = await this.gameRepository.findOne({
			where: [{ isActive: false, lastActiveDate: IsNull() }],
			order: { id: 'DESC' },
		});

		if (game) {
			return game;
		}

		game = await this.gameRepository.findOne({
			where: { isActive: false, lastActiveDate: Not(IsNull()) },
			order: { lastActiveDate: 'ASC' },
		});

		if (game) {
			return game;
		}

		throw new NotFoundException('No available games found.');
	}
}
