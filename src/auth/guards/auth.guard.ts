import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info) {
		if (err || !user) {
			throw err || new UnauthorizedException('Unauthorized');
		}
		if (user.role !== 'user') {
			throw new UnauthorizedException('Access restricted to users only');
		}
		return user;
	}
}