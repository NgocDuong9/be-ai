import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Áo thun', description: 'Tên sản phẩm' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Áo thun nam, chất liệu cotton',
    description: 'Mô tả sản phẩm',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 150000, description: 'Giá sản phẩm', minimum: 0 })
  @IsNumber()
  @Min(0)
  priceDetail: number;

  @ApiProperty({ example: 1500, description: 'Giá giảm', minimum: 0 })
  @IsNumber()
  @Min(0)
  discountPrice: number;

  @ApiProperty({ example: 'category-123', description: 'ID danh mục' })
  @IsString()
  @IsNotEmpty()
  category: string; // Category ID

  @ApiProperty({
    example: ['image1.jpg', 'image2.png'],
    description: 'Danh sách hình ảnh',
    required: false,
  })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 100, description: 'Số lượng trong kho', minimum: 0 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'Adidas', description: 'Thương hiệu' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    example: true,
    description: 'Trạng thái kích hoạt',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
