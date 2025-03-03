import {forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { CreateObtainedBadgeDto } from './dto/create-obtained-badge.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ObtainedBadge} from "./entities/obtained-badge.entity";
import {UsersService} from "../users/users.service";
import {BadgesService} from "../badges/badges.service";

@Injectable()
export class ObtainedBadgesService {
  public constructor(
    @InjectRepository(ObtainedBadge)
    private readonly obtainedBadgeRepository: Repository<ObtainedBadge>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => BadgesService))
    private readonly badgesService: BadgesService,
    ) {}

  public async create(createObtainedBadgeDto: CreateObtainedBadgeDto): Promise<void> {
    const user = await this.usersService.findOneById(createObtainedBadgeDto.userId);
    const badge = await this.badgesService.findOne(createObtainedBadgeDto.badgeId);

    if (!user || !badge) {
      throw new Error('User or Badge not found');
    }

    const obtainedBadge = this.obtainedBadgeRepository.create({
      user,
      badge,
    });

    await this.obtainedBadgeRepository.save(obtainedBadge);
  }

  public async findAll(userId?: string): Promise<ObtainedBadge[]> {
    const queryBuilder = this.obtainedBadgeRepository.createQueryBuilder()
      .leftJoinAndSelect('ObtainedBadge.user', 'user')
      .leftJoinAndSelect('ObtainedBadge.badge', 'badge');

    if (userId) {
      queryBuilder.where('ObtainedBadge.userId = :userId', { userId })
    }

    return queryBuilder
      .getMany()
  }

  public async findOne(id: string): Promise<ObtainedBadge> {
    const obtainedBadge = await this.obtainedBadgeRepository.findOne({ where: { id: id } });
    if (!obtainedBadge) {
      throw new NotFoundException();
    }

    return obtainedBadge;
  }
}
