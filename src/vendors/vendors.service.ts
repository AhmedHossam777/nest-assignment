import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Model } from 'mongoose';
import { Vendor, VendorDocument } from './entities/vendor.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class VendorsService {
	constructor(
		@InjectModel(Vendor.name) private VendorModel: Model<VendorDocument>,
	) {}

	async create(createVendorDto: CreateVendorDto): Promise<VendorDocument> {
		const vendor = await this.VendorModel.create(createVendorDto);

		return vendor;
	}

	async findAll(): Promise<VendorDocument[] | null> {
		const vendors = await this.VendorModel.find().exec();

		return vendors;
	}

	async findOne(id: string): Promise<VendorDocument | null> {
		const vendor = await this.VendorModel.findById(id).exec();
		if (!vendor)
			throw new NotFoundException(`vendor with id : ${id} not found`);

		return vendor;
	}

	async findByEmail(email: string): Promise<VendorDocument | null> {
		const vendor = await this.VendorModel.findOne({ email }).exec();
		if (!vendor)
			throw new NotFoundException(`vendor with email : ${email} not found`);

		return vendor;
	}

	async update(
		id: string,
		updateVendorDto: UpdateVendorDto,
	): Promise<VendorDocument | null> {
		const newVendor = await this.VendorModel.findByIdAndUpdate(
			id,
			updateVendorDto,
			{ new: true },
		);

		if (!newVendor)
			throw new NotFoundException(`vendor with id : ${id} not found`);

		return newVendor;
	}

	async remove(id: string): Promise<VendorDocument | null> {
		const deletedVendor = await this.VendorModel.findByIdAndDelete(id).exec();
		if (!deletedVendor)
			throw new NotFoundException(`vendor with id : ${id} not found`);

		return deletedVendor;
	}
}