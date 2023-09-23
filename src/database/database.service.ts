import { DataSource } from 'typeorm';
import { uniqBy } from 'lodash';
import { readFileSync } from 'fs';
import { newDb, IMemoryDb, IBackup } from 'pg-mem';
import { Injectable } from '@nestjs/common';
import { User } from '../users/user.model';

@Injectable()
export class DatabaseService {
  private backup: IBackup;
  private dataSource: DataSource;
  private db: IMemoryDb;

  constructor() {
    this.db = newDb({
      autoCreateForeignKeyIndices: true,
    });
    this.createOrm();
  }

  async createOrm() {
    await this.dataSource?.destroy();

    this.db.public.registerFunction({
      implementation: () => 'test',
      name: 'current_database',
    });

    this.db.public.registerFunction({
      implementation: () => '1.0',
      name: 'version',
    });

    // this.db.public.interceptQueries(queryText => {
    //   if (queryText.search(/(pg_views|pg_matviews|pg_tables|pg_enum)/g) > -1) {
    //   return [];
    //   }
    //   return null;
    // });

    this.dataSource = await this.db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [User]
    });

    if (!this.backup) {
      await this.dataSource.initialize();
      await this.dataSource.synchronize();
      const users = this.dataSource.getRepository(User);

      const jsonData = readFileSync('user-collection.json', 'utf-8');
      const usersData = JSON.parse(jsonData);
      const uniqueUsers = uniqBy(usersData, 'id');

      for (const user of uniqueUsers) {
        const u = users.create(user);
        await users.save(u);
      }

      this.backup = this.db.backup();
    } else {
      this.backup.restore();
    }

    return this.dataSource;
  }

  getDatabase() {
    return this.dataSource;
  }
}
