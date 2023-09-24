import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserCountByCountry, AvgEarningsByCountry } from './user.interface';
import { FindManyOptions } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(options: FindManyOptions): Promise<User[]> {
    return this.usersService.findAll(options);
  }

  @Get('count-by-country')
  countByCountry(): Promise<UserCountByCountry[]> {
    return this.usersService.countByCountry();
  }

  @Get('avg-earnings-by-country')
  averageEarningsByCountry(): Promise<AvgEarningsByCountry[]> {
    return this.usersService.averageEarningsByCountry();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }
}
