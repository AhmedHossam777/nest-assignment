import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateVendorDto } from '../vendors/dto/create-vendor.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/user/register')
	registerUser(@Body() createUserDto: CreateUserDto) {
		return this.authService.registerUser(createUserDto);
	}

	@Post('/user/login')
	loginUser(@Body() loginDto: LoginDto) {
		return this.authService.loginUser(loginDto);
	}

	@Post('/vendor/register')
	registerVendor(@Body() createVendorDto: CreateVendorDto) {
		return this.authService.registerVendor(createVendorDto);
	}

	@Post('/vendor/login')
	loginVendor(@Body() loginDto: LoginDto) {
		return this.authService.loginVendor(loginDto);
	}
}