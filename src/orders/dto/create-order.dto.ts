import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Đường Đồng Khởi, Quận 1, TP.HCM',
    description: 'Địa chỉ giao hàng',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({
    example: 'Giao giờ hành chính, gọi trước khi đến',
    description: 'Ghi chú',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    example: 'COD',
    description: 'Phương thức thanh toán (ví dụ: COD, Credit Card)',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên khách hàng',
  })
  @IsString()
  @IsNotEmpty()
  nameClient: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Số điện thoại khách hàng',
  })
  @IsString()
  @IsNotEmpty()
  phoneClient: string;
}
