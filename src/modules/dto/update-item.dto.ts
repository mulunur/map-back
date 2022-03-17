import { IsString } from 'class-validator';
import { BaseDto } from '../base/base.dto';

export class UpdateItemDto extends BaseDto {
  @IsString()
  readonly title!: string;
}
