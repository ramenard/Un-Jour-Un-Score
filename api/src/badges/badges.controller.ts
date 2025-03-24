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
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { SecurityGuard } from '../security/security.guard';
import { Badge } from './entities/badge.entity';

@UseGuards(SecurityGuard)
@Controller('badges')
export class BadgesController {
	constructor(private readonly badgesService: BadgesService) {}

	@Post()
	public create(@Body() createBadgeDto: CreateBadgeDto): Promise<void> {
		return this.badgesService.create(createBadgeDto);
	}

	@Get()
	public findAll(): Promise<Badge[]> {
		return this.badgesService.findAll();
	}

	@Get(':id')
	public findOne(@Param('id') id: string): Promise<Badge> {
		return this.badgesService.findOne(id);
	}

	@Patch(':id')
	public update(
		@Param('id') id: string,
		@Body() updateBadgeDto: UpdateBadgeDto,
	): Promise<Badge> {
		return this.badgesService.update(id, updateBadgeDto);
	}

	@Delete(':id')
	public remove(@Param('id') id: string): Promise<void> {
		return this.badgesService.remove(id);
	}
}
