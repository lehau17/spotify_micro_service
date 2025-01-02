import { PartialType } from '@nestjs/swagger';
import { CreateFollowingDto } from './create-folowing.dto';

export class UpdateFolowingDto extends PartialType(CreateFollowingDto) {}
