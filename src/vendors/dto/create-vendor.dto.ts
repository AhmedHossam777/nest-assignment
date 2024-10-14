import { IsString, IsEmail } from 'class-validator';

export class CreateVendorDto {
	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;
}