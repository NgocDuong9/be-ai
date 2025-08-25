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
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Rolex Submariner 124060', description: 'Tên đồng hồ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Đồng hồ lặn thép không gỉ, máy tự động, kính sapphire',
    description: 'Mô tả sản phẩm',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 150000000, description: 'Giá niêm yết (VND)', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceDetail: number;

  @ApiProperty({ example: 5000000, description: 'Số tiền giảm (VND)', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountPrice: number;

  @ApiProperty({ example: '66c0a1b2f3e4d5c6b7a89012', description: 'ID danh mục (ObjectId)' })
  @IsString()
  @IsNotEmpty()
  category: string; // Category ID

  @ApiProperty({
    example: ['submariner-front.jpg', 'submariner-back.png'],
    description: 'Danh sách hình ảnh',
    required: false,
  })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 5, description: 'Số lượng trong kho', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'Rolex', description: 'Thương hiệu' })
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
