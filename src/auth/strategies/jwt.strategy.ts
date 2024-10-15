import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { VendorsService } from '../../vendors/vendors.service';

interface Payload {
	sub: string; // user or vendor id
	role: 'user' | 'vendor';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly usersService: UsersService,
		private readonly vendorsService: VendorsService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: Payload) {
		const user = await this.usersService.findOne(payload.sub);
		const vendor = await this.vendorsService.findOne(payload.sub);
		if (user) {
			return user;
		}
		if (vendor) {
			return vendor;
		}
		throw new UnauthorizedException();
	}
}