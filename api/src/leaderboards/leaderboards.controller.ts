import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	UseGuards,
} from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { Leaderboard } from './entities/leaderboard.entity';
import { SecurityGuard } from '../security/security.guard';

@UseGuards(SecurityGuard)
@Controller('leaderboards')
export class LeaderboardsController {
	constructor(private readonly leaderboardsService: LeaderboardsService) {}

	@Post()
	public create(
		@Body() createLeaderboardDto: CreateLeaderboardDto,
	): Promise<Leaderboard> {
		return this.leaderboardsService.create(createLeaderboardDto);
	}

	@Get()
	public findAll(): Promise<Leaderboard[]> {
		return this.leaderboardsService.findAll();
	}

	@Get(':id')
	public findOne(@Param('id') id: string): Promise<Leaderboard> {
		return this.leaderboardsService.findOne(id);
	}

	@Patch(':id')
	public update(
		@Param('id') id: string,
		@Body() updateLeaderboardDto: UpdateLeaderboardDto,
	): Promise<Leaderboard> {
		return this.leaderboardsService.update(id, updateLeaderboardDto);
	}
}
