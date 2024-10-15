import {
	Injectable,
	UnauthorizedException,
	ExecutionContext,
	CanActivate,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class VendorGuard extends AuthGuard('jwt') implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		return super.canActivate(context);
	}

	handleRequest(err, user, info, context: ExecutionContext) {
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		if (user.role !== 'vendor') {
			throw new UnauthorizedException();
		}
		return user;
	}
}