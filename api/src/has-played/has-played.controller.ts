import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	UseGuards,
	Query,
} from '@nestjs/common';
import { HasPlayedService } from './has-played.service';
import { CreateHasPlayedDto } from './dto/create-has-played.dto';
import { UpdateHasPlayedDto } from './dto/update-has-played.dto';
import { SecurityGuard } from '../security/security.guard';
import { HasPlayed } from './entities/has-played.entity';

@UseGuards(SecurityGuard)
@Controller('has-played')
export class HasPlayedController {
	constructor(private readonly hasPlayedService: HasPlayedService) {}

	@Post()
	public create(
		@Body() createHasPlayedDto: CreateHasPlayedDto,
	): Promise<void> {
		return this.hasPlayedService.create(createHasPlayedDto);
	}

	@Get()
	public findAll(
		@Query('userId') userId?: string,
		@Query('leaderboardId') leaderboardId?: string,
	): Promise<HasPlayed[]> {
		return this.hasPlayedService.findAll(userId, leaderboardId);
	}

	@Get(':id')
	public findOne(@Param('id') id: string): Promise<HasPlayed> {
		return this.hasPlayedService.findOne(id);
	}

	@Patch(':id')
	public update(
		@Param('id') id: string,
		@Body() updateHasPlayedDto: UpdateHasPlayedDto,
	): Promise<HasPlayed> {
		return this.hasPlayedService.update(id, updateHasPlayedDto);
	}
}
