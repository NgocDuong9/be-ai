import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Check if product exists and has enough stock
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    // Check if item already exists in cart
    const existingCartItem = await this.cartModel.findOne({
      userId,
      productId,
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new BadRequestException('Not enough stock available');
      }

      existingCartItem.quantity = newQuantity;
      return existingCartItem.save();
    } else {
      // Create new cart item
      const cartItem = new this.cartModel({
        userId,
        productId,
        quantity,
      });
      return cartItem.save();
    }
  }

  async getCart(userId: string) {
    const cartItems = await this.cartModel
      .find({ userId })
      .populate({
        path: 'productId',
        populate: {
          path: 'category',
          select: 'name',
        },
      })
      .exec();

    // Calculate total
    let total = 0;
    const items = cartItems.map((item) => {
      const product = item.productId as any;
      const subtotal = product.price * item.quantity;
      total += subtotal;

      return {
        _id: item._id,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          stock: product.stock,
          category: product.category,
        },
        quantity: item.quantity,
        subtotal,
      };
    });

    return {
      items,
      total,
      itemCount: items.length,
    };
  }

  async updateCartItem(userId: string, cartItemId: string, updateCartDto: UpdateCartDto) {
    const { quantity } = updateCartDto;

    const cartItem = await this.cartModel
      .findOne({ _id: cartItemId, userId })
      .populate('productId');

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const product = cartItem.productId as any;
    
    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    cartItem.quantity = quantity;
    return cartItem.save();
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const cartItem = await this.cartModel.findOne({ _id: cartItemId, userId });
    
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartModel.findByIdAndDelete(cartItemId);
    
    return {
      message: 'Item removed from cart successfully',
    };
  }

  async clearCart(userId: string) {
    await this.cartModel.deleteMany({ userId });
    
    return {
      message: 'Cart cleared successfully',
    };
  }

  async getCartItemCount(userId: string) {
    const count = await this.cartModel.countDocuments({ userId });
    return { count };
  }
}

