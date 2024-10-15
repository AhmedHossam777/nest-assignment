import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateVendorDto } from '../vendors/dto/create-vendor.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

//* In Future we can make 2 token authenticaion for user and vendor
@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly vendorsService: VendorsService,
		private readonly jwtService: JwtService,
	) {}

	async generateTokens(id: string, role: 'user' | 'vendor') {
		const payload = { sub: id, role };
		return {
			access_token: this.jwtService.sign(payload, {
				secret: process.env.JWT_SECRET,
				expiresIn: process.env.JWT_EXPIRATION_TIME || '60m',
			}),
		};
	}

	async registerUser(createUserDto: CreateUserDto) {
		const { email } = createUserDto;
		const userExists = await this.usersService.findByEmail(email);
		if (userExists) {
			throw new BadRequestException('User already exists');
		}

		const user = await this.usersService.create(createUserDto);
		console.log(user);

		const token = await this.generateTokens(user._id.toString(), 'user');
		console.log(token);

		const { password, ...result } = user.toObject();

		return {
			token,
			user: result,
		};
	}

	async loginUser(loginDto: LoginDto) {
		const user = await this.usersService.findByEmail(loginDto.email);
		if (!user) throw new BadRequestException('Invalid credentials');

		const isValid = await bcrypt.compare(loginDto.password, user.password);
		if (!isValid) throw new BadRequestException('Invalid credentials');

		const token = await this.generateTokens(user._id.toString(), 'user');

		const { password, ...result } = user.toObject();

		return {
			token,
			user: result,
		};
	}

	async registerVendor(createVendorDto: CreateVendorDto) {
		const { email } = createVendorDto;
		const vendorExists = await this.vendorsService.findByEmail(email);
		if (vendorExists) {
			throw new BadRequestException('User already exists');
		}

		const vendor = await this.vendorsService.create(createVendorDto);
		const token = await this.generateTokens(vendor._id.toString(), 'vendor');

		const { password, ...result } = vendor.toObject();

		return {
			token,
			vendor: result,
		};
	}

	async loginVendor(loginDto: LoginDto) {
		const vendor = await this.vendorsService.findByEmail(loginDto.email);
		if (!vendor) throw new BadRequestException('Invalid credentials');

		const isValid = await bcrypt.compare(loginDto.password, vendor.password);
		if (!isValid) throw new BadRequestException('Invalid credentials');

		const token = await this.generateTokens(vendor._id.toString(), 'vendor');

		const { password, ...result } = vendor.toObject();

		return {
			token,
			vendor: result,
		};
	}
}
