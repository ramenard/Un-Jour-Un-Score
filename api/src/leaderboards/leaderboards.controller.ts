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

class UserLeaderboard {}

@Controller('leaderboards')
export class LeaderboardsController {
	constructor(private readonly leaderboardsService: LeaderboardsService) {}

	@UseGuards(SecurityGuard)
	@Post()
	public create(
		@Body() createLeaderboardDto: CreateLeaderboardDto,
	): Promise<Leaderboard> {
		return this.leaderboardsService.create(createLeaderboardDto);
	}

	@UseGuards(SecurityGuard)
	@Get()
	public findAll(): Promise<Leaderboard[]> {
		return this.leaderboardsService.findAll();
	}

	@UseGuards(SecurityGuard)
	@Get(':id')
	public findOne(@Param('id') id: string): Promise<Leaderboard> {
		return this.leaderboardsService.findOne(id);
	}

	@UseGuards(SecurityGuard)
	@Get('current')
	public findCurrent(): Promise<Leaderboard> {
		return this.leaderboardsService.getCurrent();
	}

	@Get('/userLeaderboard')
	public getCurrentLeaderboard(): Promise<UserLeaderboard[]> {
		return this.leaderboardsService.getUserLeaderboard();
	}

	@UseGuards(SecurityGuard)
	@Patch(':id')
	public update(
		@Param('id') id: string,
		@Body() updateLeaderboardDto: UpdateLeaderboardDto,
	): Promise<Leaderboard> {
		return this.leaderboardsService.update(id, updateLeaderboardDto);
	}
}
