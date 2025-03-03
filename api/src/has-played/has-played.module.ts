import { Module } from '@nestjs/common';
import { HasPlayedService } from './has-played.service';
import { HasPlayedController } from './has-played.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasPlayed } from './entities/has-played.entity';
import { UsersModule } from '../users/users.module';
import { LeaderboardsModule } from '../leaderboards/leaderboards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HasPlayed]),
    UsersModule,
    LeaderboardsModule,
  ],
  controllers: [HasPlayedController],
  providers: [HasPlayedService],
})
export class HasPlayedModule {}
