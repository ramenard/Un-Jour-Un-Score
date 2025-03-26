import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { SecurityGuard } from '../security/security.guard';

@UseGuards(SecurityGuard)
@Controller('games')
export class GamesController {
	constructor(private readonly gamesService: GamesService) {}

	@Post()
	public create(@Body() createGameDto: CreateGameDto): Promise<void> {
		return this.gamesService.create(createGameDto);
	}

	@Get()
	public findAll(): Promise<Game[]> {
		return this.gamesService.findAll();
	}

	@Get('/nextGame')
	public findTest(): Promise<Game> {
		return this.gamesService.findNextGame();
	}

	@Get(':id')
	public findOne(@Param('id') id: string): Promise<Game> {
		return this.gamesService.findOne(id);
	}

	@Patch(':id')
	public update(
		@Param('id') id: string,
		@Body() updateGameDto: UpdateGameDto,
	): Promise<Game> {
		return this.gamesService.update(id, updateGameDto);
	}

	@Delete(':id')
	public remove(@Param('id') id: string): Promise<void> {
		return this.gamesService.remove(id);
	}
}
