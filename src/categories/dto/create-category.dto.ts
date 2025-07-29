import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Áo thun', description: 'Tên danh mục' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Áo thun nam',
    description: 'Mô tả danh mục',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Trạng thái kích hoạt',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
