import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class VendorAuthGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info) {
		if (err || !user) {
			throw err || new UnauthorizedException('Unauthorized');
		}
		if (user.role !== 'vendor') {
			throw new UnauthorizedException('Access restricted to vendors only');
		}
		return user;
	}
}