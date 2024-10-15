import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Category } from '../../category/entities/category.entity';

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
	name: string;

	@Prop({ required: true })
	price: number;

	@Prop({ type: Types.ObjectId, ref: Vendor.name, required: true })
	vendor: Types.ObjectId | Vendor;

	// @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
	// category: Types.ObjectId | Category;
}

export type ProductDocument = Product & Document;

const ProductSchema = SchemaFactory.createForClass(Product);

export default ProductSchema;