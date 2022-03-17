import { IsString } from 'class-validator';
import { BaseDto } from '../base/base.dto';

export class CreateItemDto extends BaseDto {
  @IsString()
  readonly title!: string;
}
