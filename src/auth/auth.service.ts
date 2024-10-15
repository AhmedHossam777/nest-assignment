import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateVendorDto } from '../vendors/dto/create-vendor.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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

	async validateUser(loginDto: LoginDto) {
		const user = await this.usersService.findByEmail(loginDto.email);
		if (user && user.password === loginDto.password) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async validateVendor(loginDto: LoginDto) {
		const vendor = await this.vendorsService.findByEmail(loginDto.email);
		if (vendor && vendor.password === loginDto.password) {
			const { password, ...result } = vendor;
			return result;
		}
		return null;
	}

	async login(loginDto: LoginDto) {
		const user = await this.validateUser(loginDto);
		const vendor = await this.validateVendor(loginDto);
		if (user) {
			return user;
		}
		if (vendor) {
			return vendor;
		}
		return null;
	}

	async registerUser(createUserDto: CreateUserDto) {
		const { password, email } = createUserDto;
		const dupUser = await this.usersService.findByEmail(email);
		if (dupUser) {
			throw new BadRequestException('User already exists');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await this.usersService.create({
			...createUserDto,
			password: hashedPassword,
		});

		// const tokens = await this.generateTokens(user._id as string);

		return user;
	}

	async registerVendor(createVendorDto: CreateVendorDto) {
		return await this.vendorsService.create(createVendorDto);
	}
}