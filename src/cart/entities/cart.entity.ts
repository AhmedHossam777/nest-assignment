import { Product } from './../../products/entities/product.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
	user: Types.ObjectId;

	@Prop([
		{
			product: { type: Types.ObjectId, ref: Product.name, required: true },
			quantity: { type: Number, required: true, min: 1 },
		},
	])
	items: {
		product: Types.ObjectId;
		quantity: number;
	}[];
}

export type CartDocument = Cart & Document;

export const CartSchema = SchemaFactory.createForClass(Cart);
