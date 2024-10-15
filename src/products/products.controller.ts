import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Request,
	NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';
import { VendorAuthGuard } from '../auth/guards/vendor.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Model } from 'mongoose';

@Controller('products')
export class ProductsController {
	constructor(
		@InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
		private readonly productsService: ProductsService,
	) {}

	@UseGuards(VendorAuthGuard)
	@Post()
	create(@Body() createProductDto: CreateProductDto, @Request() req: any) {
		const vendorId = req.user.id;
		return this.productsService.create(createProductDto, vendorId);
	}

	@Get()
	findAll() {
		return this.productsService.findAll();
	}

	@Get('category/:category')
	findByCategory(@Param('category', MongoIdPipe) category: string) {
		return this.productsService.findByCategory(category);
	}

	@UseGuards(VendorAuthGuard)
	@Get('my-products')
	async getMyProducts(@Request() req: any) {
		const vendorId = req.user.id;
		console.log(vendorId);
		return this.productsService.getAllMyProducts(vendorId);
	}

	@Get(':id')
	findOne(@Param('id', MongoIdPipe) id: string) {
		return this.productsService.findOne(id);
	}

	@UseGuards(VendorAuthGuard)
	@Patch(':id')
	async update(
		@Request() req: any,
		@Param('id', MongoIdPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
	) {
		const vendorId = req.user.id;
		console.log(vendorId);

		const existProduct = await this.productsService.getProductByVendor(
			vendorId,
			id,
		);
		if (!existProduct)
			throw new NotFoundException(
				`there is not product with id ${id} with vendor ${vendorId}`,
			);

		return this.productsService.update(id, updateProductDto);
	}

	@UseGuards(VendorAuthGuard)
	@Delete(':id')
	async remove(@Param('id', MongoIdPipe) id: string, @Request() req: any) {
		const vendorId = req.user.id;
		console.log(vendorId);

		const existProduct = await this.productsService.getProductByVendor(
			vendorId,
			id,
		);
		if (!existProduct)
			throw new NotFoundException(
				`there is not product with id ${id} with vendor ${vendorId}`,
			);
		return this.productsService.remove(id);
	}
}