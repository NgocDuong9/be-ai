import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Đường ABC, Quận 1',
    description: 'Địa chỉ giao hàng',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({
    example: 'Giao hàng nhanh',
    description: 'Ghi chú',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  notes?: string;

  @ApiProperty({
    example: 'Thanh toán khi nhận hàng',
    description: 'Phương thức thanh toán',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên khách hàng',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  nameClinet: string;

  @ApiProperty({
    example: '0123445567',
    description: 'Số điện thoại khách hàng',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  phoneClinet: string;
}
