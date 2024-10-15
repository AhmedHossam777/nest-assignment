import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateVendorDto } from '../vendors/dto/create-vendor.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly vendorsService: VendorsService,
		private readonly jwtService: JwtService,
	) {}

	async generateTokens(id: string) {
		const payload = { sub: id };
		return {
			access_token: this.jwtService.sign(payload, {
				secret: process.env.JWT_SECRET,
				expiresIn: process.env.JWT_EXPIRATION,
			}),
		};
	}

	async registerUser(createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto);

		const token = await this.generateTokens(user._id as string);

		return {
			token,
			user,
		};
	}

	async loginUser(loginDto: LoginDto) {
		const user = await this.usersService.findByEmail(loginDto.email);
		if (!user) throw new BadRequestException('Invalid credentials');

		const userInstance = new User();
		Object.assign(userInstance, user);

		const isValid = await userInstance.validatePassword(
			loginDto.password,
			user.password,
		);

		if (!isValid) throw new BadRequestException('Invalid credentials');

		const token = await this.generateTokens(user._id as string);

		return {
			token,
			user,
		};
	}

	async registerVendor(createVendorDto: CreateVendorDto) {
		const vendor = await this.vendorsService.create(createVendorDto);
		const token = await this.generateTokens(vendor._id as string);

		return {
			token,
			vendor,
		};
	}

	async loginVendor(loginDto: LoginDto) {
		const vendor = await this.vendorsService.findByEmail(loginDto.email);
		if (!vendor) throw new BadRequestException('Invalid credentials');

		const vendorInstance = new Vendor();
		Object.assign(vendorInstance, vendor);

		const isValid = await vendorInstance.validatePassword(
			loginDto.password,
			vendor.password,
		);
		if (!isValid) throw new BadRequestException('Invalid credentials');

		const token = await this.generateTokens(vendor._id as string);

		return {
			token,
			vendor,
		};
	}
}