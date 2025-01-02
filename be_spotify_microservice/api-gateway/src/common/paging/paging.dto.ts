import { ApiProperty } from '@nestjs/swagger';

export class PagingDto {
  @ApiProperty({
    description: 'Limit for pagination',
    type: Number,
    default: 20,
    required: false,
  })
  limit: number;

  @ApiProperty({
    description: 'Page number for pagination',
    type: Number,
    default: 1,
    required: false,
  })
  page: number;

  @ApiProperty({
    description: 'Cursor for pagination',
    type: Number,
    required: false,
  })
  cursor: number;
}
