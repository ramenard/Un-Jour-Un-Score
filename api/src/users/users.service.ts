import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from '../security/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserLeaderBoard } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly dataSource: DataSource,
	) {}

	public create(registerDto: RegisterDto): Promise<User> {
		return this.userRepository.save(registerDto);
	}

	public findAll(): Promise<User[]> {
		return this.userRepository.find({ relations: ['obtainedBadges'] });
	}

	public async findOneByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { email },
			select: ['id', 'username', 'email', 'password', 'role'],
		});
		if (!user) {
			throw new NotFoundException();
		}

		return user;
	}

	public async findOneById(id: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id: id } });
		if (!user) {
			throw new NotFoundException();
		}

		return user;
	}

	public async getCurrentLeaderboardForUser(
		userId: string,
	): Promise<UserLeaderBoard[]> {
		return await this.dataSource.query(
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
            WHERE rankScore = (SELECT rankScore - 1
                               FROM Ranked
                               WHERE userId = ?)
               OR rankScore = (SELECT rankScore + 1
                               FROM Ranked
                               WHERE userId = ?)
               OR rankScore = (SELECT rankScore + 2
                               FROM Ranked
                               WHERE userId = ?)
               OR rankScore = (SELECT rankScore
                               FROM Ranked
                               WHERE userId = ?)
            ORDER BY rankScore`,
			[userId, userId, userId, userId],
		);
	}

	public async update(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<User> {
		await this.userRepository.update(id, updateUserDto);
		return this.findOneById(id);
	}

	public async getUserCanPlay(userId: string): Promise<boolean> {
		const data: string[] = await this.dataSource.query(
			`SELECT id
             FROM user
             WHERE id = ?
               AND gameCoins > 0`,
			[userId],
		);

		return !!data.length;
	}

	public async updateTries(id: string): Promise<void> {
		await this.userRepository
			.createQueryBuilder('user')
			.leftJoin('user.hasPlayed', 'has_played')
			.update('has_played')
			.set({
				tries: () => 'tries + 1',
			})
			.where('user.id = :id', { id })
			.execute();
	}

	public async updateScore(
		id: string,
		score: { score: number },
	): Promise<void> {
		await this.userRepository
			.createQueryBuilder('user')
			.leftJoin('user.hasPlayed', 'has_Played')
			.update('has_played')
			.set({
				score: score.score,
			})
			.where('user.id = :id', { id })
			.execute();
	}
}
