import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import VendorSchema, { Vendor } from './entities/vendor.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
	],
	controllers: [VendorsController],
	providers: [VendorsService],
})
export class VendorsModule {}