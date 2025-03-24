import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from '../security/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User, UserLeaderBoard } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource() private readonly dataSource: DataSource,
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
  ): Promise<UserLeaderBoard> {
    return await this.dataSource.query(
      `WITH Ranked AS (SELECT hasPlayed.userId,
                                user.username,
                                hasPlayed.score,
                                ROW_NUMBER() OVER ( ORDER BY hasPlayed.score DESC ) AS rankScore
                         FROM has_played as hasPlayed
                                  JOIN \`user\` as user
         ON user.id = hasPlayed.userId
             )
        SELECT username, score, rankScore
        FROM Ranked
        WHERE rankScore <= 10
           OR rankScore = (SELECT rankScore - 1
                           FROM Ranked
                           WHERE userId = ?)
           OR rankScore = (SELECT rankScore + 1
                           FROM Ranked
                           WHERE userId = ?)
           or rankScore = (SELECT rankScore
                           FROM Ranked
                           WHERE userId = ?)
        ORDER BY rankScore`,
      [userId, userId, userId],
    );
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOneById(id);
  }
}
