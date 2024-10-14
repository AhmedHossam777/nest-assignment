import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
})
export class Product {
	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	price: number;

	@Prop({ type: Types.ObjectId, ref: Vendor.name, required: true })
	vendor: Types.ObjectId | Vendor;
}

export type ProductDocument = Product & Document;

const ProductSchema = SchemaFactory.createForClass(Product);

export default ProductSchema;