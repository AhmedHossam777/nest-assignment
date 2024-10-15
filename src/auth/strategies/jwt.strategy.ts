// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { VendorsService } from '../../vendors/vendors.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

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

	async validate(payload: JwtPayload) {
		if (payload.role === 'user') {
			const user = await this.usersService.findById(payload.sub);
			if (user) {
				// Attach role and userId to the request object
				return { id: user._id.toString(), role: 'user' };
			}
		} else if (payload.role === 'vendor') {
			const vendor = await this.vendorsService.findById(payload.sub);
			if (vendor) {
				// Attach role and vendorId to the request object
				return { id: vendor._id.toString(), role: 'vendor' };
			}
		}
		throw new UnauthorizedException();
	}
}
