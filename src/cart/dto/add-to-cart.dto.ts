import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: '66c0a1b2f3e4d5c6b7a89012', description: 'ID sản phẩm (ObjectId)' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1, description: 'Số lượng sản phẩm', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
