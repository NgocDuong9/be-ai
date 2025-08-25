import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @CurrentUser() user: any,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user._id, createOrderDto);
  }

  @Get('my-orders')
  getUserOrders(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.ordersService.findUserOrders(
      user._id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllOrders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.ordersService.findAllOrders(parseInt(page), parseInt(limit));
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.findOne(id, user._id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }
}
