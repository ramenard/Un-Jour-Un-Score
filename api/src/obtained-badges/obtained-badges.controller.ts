import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	UseGuards,
	Query,
} from '@nestjs/common';
import { ObtainedBadgesService } from './obtained-badges.service';
import { CreateObtainedBadgeDto } from './dto/create-obtained-badge.dto';
import { SecurityGuard } from '../security/security.guard';

@UseGuards(SecurityGuard)
@Controller('obtained-badges')
export class ObtainedBadgesController {
	constructor(
		private readonly obtainedBadgesService: ObtainedBadgesService,
	) {}

	@Post()
	create(@Body() createObtainedBadgeDto: CreateObtainedBadgeDto) {
		return this.obtainedBadgesService.create(createObtainedBadgeDto);
	}

	@Get()
	findAll(@Query('userId') userId?: string) {
		return this.obtainedBadgesService.findAll(userId);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.obtainedBadgesService.findOne(id);
	}
}
