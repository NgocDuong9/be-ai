import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryProductDto {
  @ApiProperty({
    description: 'Tên danh mục (ví dụ: Luxury Watches)',
    example: 'Luxury Watches',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Thương hiệu',
    example: 'Rolex',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({
    description: 'Giá tối thiểu (VND)',
    example: 50000000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Giá tối đa (VND)',
    example: 300000000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm',
    example: 'Submariner',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Trang',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Giới hạn',
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    example: 'createdAt',
    description: 'Sắp xếp theo',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({
    example: 'desc',
    description: 'Thứ tự sắp xếp (asc/desc)',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
