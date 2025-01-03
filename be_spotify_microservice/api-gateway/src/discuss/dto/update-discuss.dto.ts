import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateDiscussDto {
  @ApiProperty({
    description: 'Nội dung của bình luận',
    example: 'This is a comment.',
  })
  @IsString()
  content: string;
}
