import { User } from 'src/entities/user/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Redis } from 'ioredis';
import { CacheKeys } from 'src/core/cache/cache.interface';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const redis = new Redis({
      port: 6379,
      host: '127.0.0.1',
    });

    const users: Partial<User>[] = [
      {
        name: 'test',
        score: 100,
      },
      {
        name: 'test2',
        score: 200,
      },
      {
        name: 'test3',
        score: 300,
      },
      {
        name: 'test4',
        score: 400,
      },
      {
        name: 'test5',
        score: 500,
      },
      {
        name: 'test6',
        score: 600,
      },
      {
        name: 'test7',
        score: 700,
      },
      {
        name: 'test8',
        score: 800,
      },
      {
        name: 'test9',
        score: 900,
      },
      {
        name: 'test10',
        score: 1000,
      },
      {
        name: 'test11',
        score: 1100,
      },
      {
        name: 'test12',
        score: 1200,
      },
      {
        name: 'test13',
        score: 1300,
      },
      {
        name: 'test14',
        score: 1400,
      },
      {
        name: 'test15',
        score: 1500,
      },
      {
        name: 'test16',
        score: 1600,
      },
      {
        name: 'test17',
        score: 1700,
      },
      {
        name: 'test18',
        score: 1800,
      },
      {
        name: 'test19',
        score: 1900,
      },
      {
        name: 'test20',
        score: 2000,
      },
      {
        name: 'test21',
        score: 2100,
      },
      {
        name: 'test22',
        score: 2200,
      },
      {
        name: 'test23',
        score: 2300,
      },
      {
        name: 'test24',
        score: 2400,
      },
    ];

    // Create entity instances
    const userEntities = userRepository.create(users);

    // Save the created entities
    await userRepository.save(userEntities);

    for (const user of userEntities) {
      await redis.zadd(CacheKeys.UserRank, user.score ?? 0, user.id ?? '');
    }
  }
}
