import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // Verify category exists
    const category = await this.categoryModel.findById(
      createProductDto.category,
    );

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const { priceDetail, discountPrice, ...rest } = createProductDto;

    if (priceDetail <= 0) {
      throw new BadRequestException('priceDetail must be greater than 0');
    }
    if (discountPrice < 0) {
      throw new BadRequestException('discountPrice cannot be negative');
    }
    if (discountPrice > priceDetail) {
      throw new BadRequestException('discountPrice cannot exceed priceDetail');
    }

    const discountPercent = (discountPrice / priceDetail) * 100;

    const product = new this.productModel({
      ...rest,
      priceDetail,
      discountPrice,
      discountPercent,
      price: priceDetail - discountPrice,
    });

    return await product.save();
  }

  async findAll(queryDto: QueryProductDto) {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const filter: any = { isActive: true };

    if (category) {
      const categoryDoc = await this.categoryModel.findOne({
        name: { $regex: `^${category}$`, $options: 'i' },
        isActive: true,
      });

      if (!categoryDoc) {
        return {
          products: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
          },
        };
      }
      filter.category = categoryDoc._id;
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('category', 'name description')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category', 'name description')
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // Check if product exists
    await this.findOne(id);

    // Verify category exists if category is being updated
    if (updateProductDto.category) {
      const category = await this.categoryModel.findById(
        updateProductDto.category,
      );
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('category', 'name description')
      .exec();

    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    // Soft delete by setting isActive to false
    const deletedProduct = await this.productModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    return {
      message: 'Product deleted successfully',
      product: deletedProduct,
    };
  }

  async addImage(id: string, imagePath: string) {
    const product = await this.findOne(id);

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, { $push: { images: imagePath } }, { new: true })
      .populate('category', 'name description')
      .exec();

    return updatedProduct;
  }

  async removeImage(id: string, imagePath: string) {
    const product = await this.findOne(id);

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, { $pull: { images: imagePath } }, { new: true })
      .populate('category', 'name description')
      .exec();

    return updatedProduct;
  }
}
