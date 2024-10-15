import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from '../vendors/entities/vendor.entity';

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
	) {}

	async create(createProductDto: CreateProductDto, vendor: Vendor) {
		const createdProduct = new this.ProductModel(createProductDto);
		createdProduct.vendor = vendor;
		return createdProduct.save();
	}

	async findAll() {
		const products = await this.ProductModel.find().exec();

		return products;
	}

	async findOne(id: string) {
		const product = await this.ProductModel.findById(id).exec();
		if (!product) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}

		return product;
	}

	async findByCategory(category: string) {
		const products = await this.ProductModel.find({ category }).exec();
		if (!products) {
			throw new NotFoundException(
				`Products with category ${category} not found`,
			);
		}

		return products;
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		const product = await this.ProductModel.findByIdAndUpdate(
			id,
			updateProductDto,
			{
				new: true,
			},
		).exec();

		if (!product) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}

		return product;
	}

	async remove(id: string) {
		const product = await this.ProductModel.findByIdAndDelete(id).exec();
		if (!product) {
			throw new NotFoundException(`Product with id ${id} not found`);
		}
		return product;
	}

	async getProductByVendor(vendor: string, id: string) {
		const product = await this.ProductModel.findOne({
			vendor: vendor,
			_id: id,
		}).exec();
		if (!product)
			throw new NotFoundException(`Product with vendor ${vendor} not found`);
		return product;
	}

	async getAllMyProducts(vendor: string) {
		const products = await this.ProductModel.find({ vendor }).exec();

		return products;
	}
}