import { Product } from '../../products/entities/product.entity';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
})
export class Category {
	@Prop({ required: true })
	name: string;

	@Prop({ type: Types.ObjectId, ref: Product.name, required: false })
	products: Types.ObjectId[] | Product[];
}

export type CategoryDocument = Category & Document;

const CategorySchema = SchemaFactory.createForClass(Category);

export default CategorySchema;