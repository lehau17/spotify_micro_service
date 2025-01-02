import { PartialType } from '@nestjs/mapped-types';
import { CreateGerneDto } from './create-gerne.dto';

export class UpdateGerneDto extends PartialType(CreateGerneDto) {
  id: number;
}
