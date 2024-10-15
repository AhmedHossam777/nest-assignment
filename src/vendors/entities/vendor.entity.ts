import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
})
export class Vendor {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	password: string;

	async validatePassword(candidatePassword: string): Promise<boolean> {
		return bcrypt.compare(candidatePassword, this.password);
	}
}

export type VendorDocument = Vendor & Document;

const VendorSchema = SchemaFactory.createForClass(Vendor);

VendorSchema.pre<VendorDocument>('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

export default VendorSchema;
