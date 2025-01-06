import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeSongDto } from './create-like-song.dto';

export class UpdateLikeSongDto extends PartialType(CreateLikeSongDto) {
  id: number;
}
