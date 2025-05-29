import { CustomRepository } from 'libs/common/typeorm.ex/typeorm-ex.decorator';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { User } from 'src/entities/user/user.entity';

@CustomRepository(User)
export class UserRepository extends GenericTypeOrmRepository<User> {}
