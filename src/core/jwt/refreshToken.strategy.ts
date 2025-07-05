import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MoinConfigService } from 'src/core/config/config.service';
import { JwtPayload, TokenType } from 'src/core/jwt/jwt.interface';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: MoinConfigService) {
    const jwtConfig = configService.getJwtConfig();
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    if (payload.type !== TokenType.REFRESH) {
      throw new UnauthorizedException('Invalid token type');
    }

    return payload;
  }
}
