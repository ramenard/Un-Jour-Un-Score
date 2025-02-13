import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQLHOST'),
        port: +configService.get<number>('MYSQLPORT')!,
        username: configService.get<string>('MYSQLUSER'),
        password: configService.get<string>('MYSQL_ROOT_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        url: configService.get<string>('MYSQL_DATABASE_URL'),
        entities: [User],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
