import { CartsService } from './cart.service';
import { UserAuthGuard } from './../auth/guards/auth.guard';
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
} from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(UserAuthGuard)
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}

	@Get()
	getCart(@Request() req) {
		const userId = req.user.id;
		return this.cartsService.getCart(userId);
	}

	@Post('add')
	addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
		const userId = req.user.id;
		return this.cartsService.addToCart(userId, addToCartDto);
	}

	@Patch('update/:productId')
	updateCartItem(
		@Request() req,
		@Param('productId') productId: string,
		@Body() updateCartItemDto: UpdateCartItemDto,
	) {
		const userId = req.user.id;
		return this.cartsService.updateCartItem(
			userId,
			productId,
			updateCartItemDto,
		);
	}

	@Delete('delete/:productId')
	removeFromCart(@Request() req, @Param('productId') productId: string) {
		const userId = req.user.id;
		return this.cartsService.removeFromCart(userId, productId);
	}

	@Delete('clear')
	clearCart(@Request() req) {
		const userId = req.user.id;
		return this.cartsService.clearCart(userId);
	}
}
