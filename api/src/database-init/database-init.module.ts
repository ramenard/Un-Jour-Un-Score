import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { UsersModule } from '../users/users.module';
import { DatabaseInitService } from './database-init.service';
import { SecurityModule } from '../security/security.module';

@Module({
	imports: [GamesModule, UsersModule, SecurityModule],
	providers: [DatabaseInitService],
})
export class DatabaseInitModule {}
