import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateGerneDto {
  @ApiProperty({
    description: 'nameGenre',
    type: String,
    default: 'Rap Dissing',
  })
  @IsOptional()
  nameGenre: string;
}
