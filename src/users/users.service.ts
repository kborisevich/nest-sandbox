import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from './user.model';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    const db: DataSource = this.databaseService.getDatabase();
    
    return db.manager.find(User);
  }
}
