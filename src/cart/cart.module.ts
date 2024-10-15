import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { Cart, CartSchema } from './entities/cart.entity';
import { CartsController } from './cart.controller';
import { CartsService } from './cart.service';
import { ProductsService } from 'src/products/products.service';
import ProductSchema, { Product } from 'src/products/entities/product.entity';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Cart.name, schema: CartSchema },
			{ name: Product.name, schema: ProductSchema },
		]),
		UsersModule,
		ProductsModule,
	],
	providers: [CartsService, ProductsService],
	controllers: [CartsController],
	exports: [CartsService],
})
export class CartsModule {}
