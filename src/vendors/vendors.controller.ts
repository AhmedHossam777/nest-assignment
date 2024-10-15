import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';
import { VendorAuthGuard } from '../auth/guards/vendor.guard';

@Controller('vendors')
export class VendorsController {
	constructor(private readonly vendorsService: VendorsService) {}

	@Post()
	create(@Body() createVendorDto: CreateVendorDto) {
		return this.vendorsService.create(createVendorDto);
	}

	@Get()
	@UseGuards(VendorAuthGuard)
	findAll() {
		return this.vendorsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', MongoIdPipe) id: string) {
		return this.vendorsService.findById(id);
	}

	@Patch(':id')
	update(
		@Param('id', MongoIdPipe) id: string,
		@Body() updateVendorDto: UpdateVendorDto,
	) {
		return this.vendorsService.update(id, updateVendorDto);
	}

	@Delete(':id')
	remove(@Param('id', MongoIdPipe) id: string) {
		return this.vendorsService.remove(id);
	}
}
