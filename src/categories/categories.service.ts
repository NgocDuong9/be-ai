import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Check if category name already exists
    const existingCategory = await this.categoryModel.findOne({ 
      name: createCategoryDto.name 
    });
    
    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll() {
    return this.categoryModel.find({ isActive: true }).exec();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Check if category exists
    const category = await this.findOne(id);

    // Check if new name already exists (if name is being updated)
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryModel.findOne({ 
        name: updateCategoryDto.name 
      });
      
      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    return updatedCategory;
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    
    // Soft delete by setting isActive to false
    const deletedCategory = await this.categoryModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    return {
      message: 'Category deleted successfully',
      category: deletedCategory,
    };
  }
}

