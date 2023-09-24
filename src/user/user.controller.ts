import { Controller, Get, Param, Post, Body, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { User, UserCountByCountry, AvgEarningsByCountry } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

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
  findById(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findById(+id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() user: UserDTO): Promise<User> {
    return this.usersService.create(user);
  }
}
