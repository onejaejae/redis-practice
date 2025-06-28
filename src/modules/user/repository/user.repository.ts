import { CustomRepository } from 'libs/common/typeorm.ex/typeorm-ex.decorator';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { User } from 'src/entities/user/user.entity';
import { MoreThan } from 'typeorm';

@CustomRepository(User)
export class UserRepository extends GenericTypeOrmRepository<User> {
  async getUserRank(userId: User['id']): Promise<number | null> {
    const user = await this.findByIdOrThrow(userId);

    const higherScoreCount = await this.count({
      where: { score: MoreThan(user.score) },
    });
    return higherScoreCount + 1;
  }
}
