import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.gameRepository.find();
  }

  public async findOne(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: id } });
    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }

  public async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    await this.gameRepository.update(id, updateGameDto);

    return this.findOne(id);
  }

  public async remove(id: string): Promise<void> {
    await this.gameRepository.delete(id);
  }
}
