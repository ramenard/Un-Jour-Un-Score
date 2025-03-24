import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { GamesService } from '../games/games.service';

@Injectable()
export class LeaderboardsService {
	public constructor(
		@InjectRepository(Leaderboard)
		private readonly leaderboardRepository: Repository<Leaderboard>,
		@Inject(forwardRef(() => GamesService))
		private readonly gamesService: GamesService,
	) {}

	public async create(
		createLeaderboardDto: CreateLeaderboardDto,
	): Promise<Leaderboard> {
		const game = await this.gamesService.findOne(
			createLeaderboardDto.gameId,
		);

		return this.leaderboardRepository.save({
			isClosed: createLeaderboardDto.isClosed,
			game,
		});
	}

	public findAll(): Promise<Leaderboard[]> {
		return this.leaderboardRepository.find({ relations: ['game'] });
	}

	public async findOne(id: string): Promise<Leaderboard> {
		const leaderboard = await this.leaderboardRepository.findOne({
			where: { id: id },
			relations: ['game'],
		});
		if (!leaderboard) {
			throw new NotFoundException();
		}

		return leaderboard;
	}

	public async update(
		id: string,
		updateLeaderboardDto: UpdateLeaderboardDto,
	): Promise<Leaderboard> {
		await this.leaderboardRepository.update(id, updateLeaderboardDto);
		return this.findOne(id);
	}
}
