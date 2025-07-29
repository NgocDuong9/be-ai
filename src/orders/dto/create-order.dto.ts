import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Đường ABC, Quận 1',
    description: 'Địa chỉ giao hàng',
    required: false,
  })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({
    example: 'Giao hàng nhanh',
    description: 'Ghi chú',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
