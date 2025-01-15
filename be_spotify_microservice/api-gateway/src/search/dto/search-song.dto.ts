import { IsOptional } from 'class-validator';

export class SearchSongDto {
  @IsOptional()
  limit: number;
  @IsOptional()
  page: number;
  @IsOptional()
  cursor: number;
  @IsOptional()
  text: string;
}
