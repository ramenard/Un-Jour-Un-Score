import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';

@Injectable()
export class BadgesService {
	constructor(
		@InjectRepository(Badge)
		private readonly badgeRepository: Repository<Badge>,
	) {}

	public async create(createBadgeDto: CreateBadgeDto): Promise<void> {
		await this.badgeRepository.save(createBadgeDto);
	}

	public findAll(): Promise<Badge[]> {
		return this.badgeRepository.find();
	}

	public async findOne(id: string): Promise<Badge> {
		const badge = await this.badgeRepository.findOne({ where: { id: id } });
		if (!badge) {
			throw new NotFoundException();
		}

		return badge;
	}

	public async update(
		id: string,
		updateBadgeDto: UpdateBadgeDto,
	): Promise<Badge> {
		await this.badgeRepository.update(id, updateBadgeDto);

		return this.findOne(id);
	}

	public async remove(id: string): Promise<void> {
		await this.badgeRepository.delete(id);
	}
}
