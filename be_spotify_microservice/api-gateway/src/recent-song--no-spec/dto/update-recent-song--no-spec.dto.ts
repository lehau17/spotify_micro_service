import { PartialType } from '@nestjs/swagger';
import { CreateRecentSongNoSpecDto } from './create-recent-song--no-spec.dto';

export class UpdateRecentSongNoSpecDto extends PartialType(CreateRecentSongNoSpecDto) {}
