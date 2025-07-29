import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({ required: true })
  brand: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sold: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
