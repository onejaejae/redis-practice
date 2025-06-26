import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { User } from 'src/entities/user/user.entity';
import { UserService } from './user.service';
import { UpdateUserScoreDto } from './dto/request/updateUserScore.dto';
import { GetUsersByRankDto } from './dto/request/getUsersByRank.dto';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/rank')
  async getUsersByRank(@Query() query: GetUsersByRankDto) {
    return this.service.getUsersByRank(query);
  }

  @Get('/:userId')
  async getUser(@Param('userId', ParseUUIDPipe) userId: User['id']) {
    return this.service.getUser(userId);
  }

  @Get('/:userId/rank')
  async getUserRank(@Param('userId', ParseUUIDPipe) userId: User['id']) {
    return this.service.getUserRank(userId);
  }

  @Patch('/:userId/score')
  async updateScore(
    @Param('userId', ParseUUIDPipe) userId: User['id'],
    @Body() body: UpdateUserScoreDto,
  ) {
    return this.service.updateScore(userId, body.score);
  }
}
