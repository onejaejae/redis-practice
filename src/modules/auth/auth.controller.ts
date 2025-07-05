import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user/user.entity';
import { SignUpBody } from './dto/request/signUp.body';
import { SignInBody } from './dto/request/signIn.body';
import { RefreshBody } from './dto/request/refresh.body';
import { CurrentUser } from 'src/core/decorator/currentUser.decorator';
import { ExtractJwt } from 'passport-jwt';
import { Public } from 'src/core/decorator/public.decorator';
import { RefreshTokenGuard } from 'src/core/guard/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: SignUpBody) {
    return this.authService.signUp(body);
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: SignInBody) {
    return this.authService.signIn(body);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@CurrentUser() user: User, @Request() req: Request) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? '';
    return this.authService.signOut(user.id, accessToken);
  }

  @Public()
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshBody) {
    return this.authService.refreshTokens(body.refreshToken);
  }
}
