import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDiscussDto {
  @ApiProperty({
    description: 'Nội dung của bình luận',
    example: 'This is a comment.',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'ID của bài hát',
    example: 123,
  })
  @IsInt()
  song_id: number;

  @ApiProperty({
    description: 'ID của bình luận cha (nếu đây là bình luận trả lời)',
    example: 456,
    required: false, // Đây là thuộc tính không bắt buộc
  })
  @IsInt()
  @IsOptional()
  replay_discuss_id: number;
}
