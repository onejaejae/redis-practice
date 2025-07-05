import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { AccessTokenStrategy } from './accessToken.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { UserRepositoryModule } from 'src/modules/user/repository/user-repository.module';

@Global()
@Module({
  imports: [NestJwtModule.register({}), UserRepositoryModule],
  providers: [JwtService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [JwtService],
})
export class JwtModule {}
