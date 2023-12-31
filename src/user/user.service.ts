import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from './user.model';
import { User as UserInterface, UserCountByCountry, AvgEarningsByCountry } from './user.interface';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  private repository: Repository<User>;

  constructor(private readonly databaseService: DatabaseService) {
    const database: DataSource = this.databaseService.getDatabase();

    this.repository = database.getRepository(User);
  }

  async create(user: UserDTO): Promise<User> {
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
    // ROW_NUMBER() not implemented in pg-mem, also aliases in subqueries not working
    // return this.repository.query(`
    //   SELECT
    //     country,
    //     AVG(earnings) AS averageEarnings
    //   FROM (
    //     SELECT
    //       country,
    //       earnings,
    //       ROW_NUMBER() OVER (PARTITION BY country ORDER BY earnings DESC) AS rank
    //     FROM
    //       users
    //   ) AS ranked_users
    //   WHERE
    //     rank <= 10
    //   GROUP BY
    //     country
    //   ORDER BY
    //     country;
    // `);

    return this.repository
      .createQueryBuilder('user')
      .select(['user.country', 'AVG(user.earnings) as avgEarnings'])
      .groupBy('user.country')
      .orderBy('avgEarnings', 'DESC')
      .limit(10)
      .getRawMany();
  }
}
