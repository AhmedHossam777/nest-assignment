import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../products/entities/product.entity';

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
})
export class Cart {
	@Prop({ type: Types.ObjectId, ref: Product.name, required: true })
	products: Types.ObjectId[] | Product[];

	@Prop({ required: true })
	quantity: number;
}