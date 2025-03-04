import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SecurityGuard } from '../security/security.guard';
import { RequestWithUserInfo } from '../security/security.controller';
import {User, UserLeaderBoard} from './entities/user.entity';

@UseGuards(SecurityGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SecurityGuard)
  @Get()
  public findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Get('profile')
  public getProfile(@Req() req: RequestWithUserInfo): Promise<User> {
    return this.usersService.findOneById(req.user.id);
  }

  @Get(':id/leaderboard')
  public getCurrentLeaderboardForUser(@Param('id') id: string): Promise<UserLeaderBoard> {
    return this.usersService.getCurrentLeaderboardForUser(id);
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }
}
