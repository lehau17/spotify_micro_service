import { PartialType } from '@nestjs/swagger';
import { CreateFolowingDto } from './create-folowing.dto';

export class UpdateFolowingDto extends PartialType(CreateFolowingDto) {}
