import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly vendorsService: VendorsService,
	) {}

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
}