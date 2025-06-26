import { IsNumber } from 'class-validator';

export class UpdateUserScoreDto {
  @IsNumber()
  score: number;
}
