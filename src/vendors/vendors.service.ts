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

	async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
		const vendor = await this.VendorModel.create(createVendorDto);

		return vendor;
	}

	async findAll(): Promise<Vendor[]> {
		const vendors = await this.VendorModel.find().exec();

		return vendors;
	}

	async findOne(id: string): Promise<Vendor> {
		const vendor = await this.VendorModel.findById(id).exec();
		if (!vendor)
			throw new NotFoundException(`vendor with id : ${id} not found`);

		return vendor;
	}

	async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
		const newVendor = await this.VendorModel.findByIdAndUpdate(
			id,
			updateVendorDto,
			{ new: true },
		);

		if (!newVendor)
			throw new NotFoundException(`vendor with id : ${id} not found`);

		return newVendor;
	}

	async remove(id: string): Promise<Vendor> {
		const deletedVendor = await this.VendorModel.findByIdAndDelete(id).exec();
		if (!deletedVendor)
			throw new NotFoundException(`vendor with id : ${id} not found`);

		return deletedVendor;
	}
}