import { User } from 'src/entities/user/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const users: Partial<User>[] = [
      {
        name: 'test',
      },
      {
        name: 'test2',
      },
      {
        name: 'test3',
      },
    ];

    // Create entity instances
    const userEntities = userRepository.create(users);

    // Save the created entities
    await userRepository.save(userEntities);
  }
}
