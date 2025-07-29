import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    // Get cart items
    const cartItems = await this.cartModel
      .find({ userId })
      .populate('productId')
      .exec();

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const cartItem of cartItems) {
      const product = cartItem.productId as any;
      
      if (!product.isActive) {
        throw new BadRequestException(`Product ${product.name} is not available`);
      }

      if (product.stock < cartItem.quantity) {
        throw new BadRequestException(`Not enough stock for ${product.name}`);
      }

      const subtotal = product.price * cartItem.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        subtotal,
      });
    }

    // Create order
    const order = new this.orderModel({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
      notes: createOrderDto.notes,
    });

    const savedOrder = await order.save();

    // Update product stock and sold count
    for (const cartItem of cartItems) {
      const product = cartItem.productId as any;
      await this.productModel.findByIdAndUpdate(product._id, {
        $inc: {
          stock: -cartItem.quantity,
          sold: cartItem.quantity,
        },
      });
    }

    // Clear cart
    await this.cartModel.deleteMany({ userId });

    return savedOrder;
  }

  async findUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments({ userId }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findAllOrders(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel
        .find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const query: any = { _id: id };
    if (userId) {
      query.userId = userId;
    }

    const order = await this.orderModel
      .findOne(query)
      .populate('userId', 'name email')
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    const currentStatus = order.status;
    const newStatus = updateOrderStatusDto.status;

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Cannot change status from ${currentStatus} to ${newStatus}`,
      );
    }

    // If cancelling order, restore product stock
    if (newStatus === 'cancelled' && currentStatus !== 'cancelled') {
      for (const item of order.items) {
        await this.productModel.findByIdAndUpdate(item.productId, {
          $inc: {
            stock: item.quantity,
            sold: -item.quantity,
          },
        });
      }
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { status: newStatus }, { new: true })
      .populate('userId', 'name email')
      .exec();

    return updatedOrder;
  }

  async getOrderStats() {
    const stats = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalOrders = await this.orderModel.countDocuments();
    const totalRevenue = await this.orderModel.aggregate([
      {
        $match: { status: { $in: ['delivered'] } },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats,
    };
  }
}

