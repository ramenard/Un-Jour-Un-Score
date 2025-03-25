import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { GamesService } from '../games/games.service';
import { UserLeaderBoard } from './entities/leaderboard.entity';

@Injectable()
export class LeaderboardsService {
	public constructor(
		@InjectRepository(Leaderboard)
		private readonly leaderboardRepository: Repository<Leaderboard>,
		@Inject(forwardRef(() => GamesService))
		private readonly gamesService: GamesService,
		private readonly dataSource: DataSource,
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

	public async getCurrent(): Promise<Leaderboard> {
		const leaderboard = await this.leaderboardRepository.findOne({
			where: { isClosed: false },
			relations: ['game'],
		});

		if (!leaderboard) {
			throw new NotFoundException();
		}

		return leaderboard;
	}

	public async getUserLeaderboard(): Promise<UserLeaderBoard[]> {
		return this.dataSource.query(
			`WITH Ranked AS (SELECT hasPlayed.userId,
                                user.username,
                                hasPlayed.score,
                                ROW_NUMBER() OVER ( ORDER BY hasPlayed.score DESC ) AS rankScore
                         FROM has_played as hasPlayed
                                  JOIN \`user\` as user
         ON user.id = hasPlayed.userId
             JOIN \`leaderboard\` as leaderboard ON leaderboard.id = hasPlayed.leaderboardId
             WHERE leaderboard.isClosed = FALSE
             )
        SELECT username, score, rankScore
        FROM Ranked
        WHERE rankScore <= 10
        ORDER BY rankScore`,
		);
	}

	public async update(
		id: string,
		updateLeaderboardDto: UpdateLeaderboardDto,
	): Promise<Leaderboard> {
		await this.leaderboardRepository.update(id, updateLeaderboardDto);
		return this.findOne(id);
	}
}
