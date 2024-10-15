import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import CategorySchema, { Category } from './entities/category.entity';
import { MongooseModule } from '@nestjs/mongoose';
import ProductSchema, { Product } from '../products/entities/product.entity';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Category.name, schema: CategorySchema },
			{ name: Product.name, schema: ProductSchema },
		]),
	],
	controllers: [CategoryController],
	providers: [CategoryService],
})
export class CategoryModule {}