import { CartDocument, Cart } from './entities/cart.entity';
import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartsService {
	constructor(
		@InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
		private readonly usersService: UsersService,
		private readonly productsService: ProductsService,
	) {}

	async getOrCreateCart(userId: string): Promise<CartDocument> {
		let cart = await this.cartModel.findOne({ user: userId }).exec();
		if (!cart) {
			cart = new this.cartModel({ user: userId, items: [] });
			await cart.save();
		}
		return cart;
	}

	async addToCart(
		userId: string,
		addToCartDto: AddToCartDto,
	): Promise<CartDocument> {
		const { productId, quantity } = addToCartDto;

		const product = await this.productsService.findOne(productId);
		if (!product)
			throw new NotFoundException(`Product with ID ${productId} not found`);

		const cart = await this.getOrCreateCart(userId);

		const existingItem = cart.items.find(
			(item) => item.product.toString() === productId,
		);
		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			cart.items.push({ product: new Types.ObjectId(productId), quantity });
		}

		return cart.save();
	}

	async removeFromCart(
		userId: string,
		productId: string,
	): Promise<CartDocument> {
		const cart = await this.getOrCreateCart(userId);

		const itemIndex = cart.items.findIndex(
			(item) => item.product.toString() === productId,
		);
		if (itemIndex === -1)
			throw new NotFoundException(
				`Product with ID ${productId} not found in cart`,
			);

		cart.items.splice(itemIndex, 1);

		return cart.save();
	}

	async updateCartItem(
		userId: string,
		productId: string,
		updateCartItemDto: UpdateCartItemDto,
	): Promise<CartDocument> {
		const { quantity } = updateCartItemDto;

		const cart = await this.getOrCreateCart(userId);

		const item = cart.items.find(
			(item) => item.product.toString() === productId,
		);
		if (!item)
			throw new NotFoundException(
				`Product with ID ${productId} not found in cart`,
			);

		if (quantity < 1)
			throw new BadRequestException('Quantity must be at least 1');

		item.quantity = quantity;

		return cart.save();
	}

	async getCart(userId: string): Promise<CartDocument> {
		const cart = await this.cartModel
			.findOne({ user: userId })
			.populate('items.product')
			.exec();
		if (!cart) throw new NotFoundException('Cart not found');
		return cart;
	}

	async clearCart(userId: string): Promise<CartDocument> {
		const cart = await this.getOrCreateCart(userId);
		cart.items = [];
		return cart.save();
	}
}
