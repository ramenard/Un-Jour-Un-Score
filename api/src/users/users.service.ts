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
    private readonly userRepository: Repository<User>,
  ) {}

  public create(registerDto: RegisterDto): Promise<User> {
    return this.userRepository.save(registerDto);
  }

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password', 'role'],
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  public async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOneById(id);
  }
}
