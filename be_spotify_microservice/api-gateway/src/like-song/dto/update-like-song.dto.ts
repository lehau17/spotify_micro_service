import { PartialType } from '@nestjs/swagger';
import { CreateLikeSongDto } from './create-like-song.dto';

export class UpdateLikeSongDto extends PartialType(CreateLikeSongDto) {}
