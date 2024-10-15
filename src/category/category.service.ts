import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(Category.name) private CategoryModel: Model<CategoryDocument>,
	) {}

	create(createCategoryDto: CreateCategoryDto) {
		const createdCategory = new this.CategoryModel(createCategoryDto);
		return createdCategory.save();
	}

	async findAll() {
		const categories = await this.CategoryModel.find()
			.populate('products')
			.exec();

		return categories;
	}

	async findOne(id: string) {
		const category = await this.CategoryModel.findById(id)
			.populate('products')
			.exec();
		if (!category) {
			throw new NotFoundException(`Category with id ${id} not found`);
		}
		return category;
	}

	async update(id: string, updateCategoryDto: UpdateCategoryDto) {
		const updatedCategory = await this.CategoryModel.findByIdAndUpdate(
			id,
			updateCategoryDto,
			{ new: true },
		)
			.populate('products')
			.exec();
		if (!updatedCategory) {
			throw new NotFoundException(`Category with id ${id} not found`);
		}
		return updatedCategory;
	}

	async remove(id: string) {
		const deletedCategory =
			await this.CategoryModel.findByIdAndDelete(id).exec();
		if (!deletedCategory) {
			throw new NotFoundException(`Category with id ${id} not found`);
		}
		return deletedCategory;
	}

	async findByName(name: string) {
		const category = await this.CategoryModel.findOne({ name })
			.populate('products')
			.exec();
		if (!category) {
			throw new NotFoundException(`Category with name ${name} not found`);
		}
		return category;
	}

	async addProductToCategory(categoryId: string, productId: any) {
		const category = await this.CategoryModel.findById(categoryId)
			.populate('products')
			.exec();
		if (!category) {
			throw new NotFoundException(`Category with id ${categoryId} not found`);
		}
		category.products.push(productId);

		return category.save();
	}

	async removeProductFromCategory(categoryId: string, productId: any) {
		const category = await this.CategoryModel.findById(categoryId).exec();
		if (!category) {
			throw new NotFoundException(`Category with id ${categoryId} not found`);
		}
		category.products = category.products.filter(
			(product: mongoose.Types.ObjectId) => !product.equals(productId),
		) as mongoose.Types.ObjectId[];
		return category.save();
	}

	async getProductsFromCategory(categoryId: string) {
		const category = await this.CategoryModel.findById(categoryId)
			.populate('products')
			.exec();
		if (!category) {
			throw new NotFoundException(`Category with id ${categoryId} not found`);
		}
		return category.products;
	}
}
