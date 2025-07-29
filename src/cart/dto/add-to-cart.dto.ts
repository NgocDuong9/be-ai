import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 'product-123', description: 'ID của sản phẩm' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Số lượng sản phẩm', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
