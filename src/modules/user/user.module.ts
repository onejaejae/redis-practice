import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../user/repository/user-repository.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RankModule } from '../rank/rank.module';

@Module({
  imports: [UserRepositoryModule, RankModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
