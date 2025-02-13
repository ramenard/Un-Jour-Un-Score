import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from '../security/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public create(registerDto: RegisterDto): Promise<User> {
    return this.usersRepository.save(registerDto);
  }

  public findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public findOneByEmail(email: string): Promise<User> {
    try {
      return this.usersRepository.findOne({
        where: { email },
        select: ['id', 'username', 'email', 'password', 'role'],
      });
    } catch {
      throw new NotFoundException();
    }
  }

  public findOneById(id: string): Promise<User> {
    try {
      return this.usersRepository.findOne({ where: { id: id } });
    } catch {
      throw new NotFoundException();
    }
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOneById(id);
  }
}
