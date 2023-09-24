import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from './user.model';
import { User as UserInterface, UserCountByCountry, AvgEarningsByCountry } from './user.interface';
import { DataSource, FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private repository: Repository<User>;

  constructor(private readonly databaseService: DatabaseService) {
    const database: DataSource = this.databaseService.getDatabase();

    this.repository = database.getRepository(User);
  }

  async create(user: UserInterface): Promise<User> {
    return this.repository.create(user).save();
  }

  async findAll(options: FindManyOptions): Promise<User[]> {
    return this.repository.find(options);
  }

  async findById(id: number): Promise<User> {
    const findOneOptions: FindManyOptions<User> = {
      where: { id },
    };

    return this.repository.findOne(findOneOptions);
  }

  async countByCountry(): Promise<UserCountByCountry[]> {
    return this.repository
      .createQueryBuilder('user')
      .select(['user.country', 'COUNT(user.id) as count'])
      .groupBy('user.country')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  // average earnings of the 10 users with highest earnings per country.
  async averageEarningsByCountry(): Promise<AvgEarningsByCountry[]> {
    return this.repository
      .createQueryBuilder('user')
      .select(['user.country', 'AVG(user.earnings) as avgEarnings'])
      .groupBy('user.country')
      .orderBy('avgEarnings', 'DESC')
      .limit(10)
      .getRawMany();
  }
}
