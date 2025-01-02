import { PartialType } from '@nestjs/swagger';
import { CreateGerneDto } from './create-gerne.dto';

export class UpdateGerneDto extends PartialType(CreateGerneDto) {}
