import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGerneDto {
  @ApiProperty({
    description: 'nameGenre',
    type: String,
    default: 'Rap Dissing',
  })
  @IsString()
  nameGenre: string;
}
