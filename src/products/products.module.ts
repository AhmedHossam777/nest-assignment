import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import ProductSchema, { Product } from './entities/product.entity';
import { MongooseModule } from '@nestjs/mongoose';
import VendorSchema, { Vendor } from '../vendors/entities/vendor.entity';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
	],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}