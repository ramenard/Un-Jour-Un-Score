import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { HasPlayedService } from './has-played.service';
import { CreateHasPlayedDto } from './dto/create-has-played.dto';
import { UpdateHasPlayedDto } from './dto/update-has-played.dto';
import { SecurityGuard } from '../security/security.guard';

@UseGuards(SecurityGuard)
@Controller('has-played')
export class HasPlayedController {
  constructor(private readonly hasPlayedService: HasPlayedService) {}

  @Post()
  create(@Body() createHasPlayedDto: CreateHasPlayedDto) {
    return this.hasPlayedService.create(createHasPlayedDto);
  }

  @Get()
  findAll() {
    return this.hasPlayedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hasPlayedService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHasPlayedDto: UpdateHasPlayedDto,
  ) {
    return this.hasPlayedService.update(id, updateHasPlayedDto);
  }
}
