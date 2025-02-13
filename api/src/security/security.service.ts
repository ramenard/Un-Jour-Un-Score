import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class SecurityService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    const saltOrRounds = 10;
    const hash = await bcryptHash(registerDto.password, saltOrRounds);
    const user = await this.usersService.create({
      ...registerDto,
      password: hash,
    });
    const payload = { id: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  public async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await bcryptCompare(password, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
