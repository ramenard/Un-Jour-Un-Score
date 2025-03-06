import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHasPlayedDto } from './dto/create-has-played.dto';
import { UpdateHasPlayedDto } from './dto/update-has-played.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HasPlayed } from './entities/has-played.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { LeaderboardsService } from '../leaderboards/leaderboards.service';

@Injectable()
export class HasPlayedService {
  public constructor(
    @InjectRepository(HasPlayed)
    public readonly hasPlayedRepository: Repository<HasPlayed>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => LeaderboardsService))
    private readonly leaderboardsService: LeaderboardsService,
  ) {}

  public async create(createHasPlayedDto: CreateHasPlayedDto): Promise<void> {
    const user = await this.usersService.findOneById(createHasPlayedDto.userId);
    const leaderboard = await this.leaderboardsService.findOne(
      createHasPlayedDto.leaderboardId,
    );

    if (!user || !leaderboard) {
      throw new Error('User or Leaderboard not found');
    }

    const hasPlayed = this.hasPlayedRepository.create({
      user,
      leaderboard,
      ...createHasPlayedDto,
    });

    await this.hasPlayedRepository.save(hasPlayed);
  }

  public findAll(): Promise<HasPlayed[]> {
    return this.hasPlayedRepository.find({
      relations: ['user', 'leaderboard'],
    });
  }

  public async findOne(id: string): Promise<HasPlayed> {
    const hasPlayed = await this.hasPlayedRepository.findOne({
      where: { id: id },
      relations: ['user', 'leaderboard'],
    });
    if (!hasPlayed) {
      throw new NotFoundException();
    }

    return hasPlayed;
  }

  public async update(
    id: string,
    updateHasPlayedDto: UpdateHasPlayedDto,
  ): Promise<HasPlayed> {
    await this.hasPlayedRepository.update(id, updateHasPlayedDto);
    return this.findOne(id);
  }
}
