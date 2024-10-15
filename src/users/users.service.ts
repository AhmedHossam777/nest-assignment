import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		return await this.UserModel.create(createUserDto);
	}

	async findAll(): Promise<User[]> {
		const users = await this.UserModel.find().exec();

		return users;
	}

	async findOne(id: string): Promise<User> {
		const user = await this.UserModel.findById(id).exec();
		if (!user) throw new NotFoundException(`user with id : ${id} not found`);

		return user;
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.UserModel.findOne({ email }).exec();
		if (!user)
			throw new NotFoundException(`user with email : ${email} not found`);

		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const newUser = await this.UserModel.findByIdAndUpdate(id, updateUserDto, {
			new: true,
		}).exec();
		if (!newUser) throw new NotFoundException(`user with id : ${id} not found`);

		return newUser;
	}

	async remove(id: string): Promise<User> {
		const deletedUser = await this.UserModel.findByIdAndDelete(id).exec();
		if (!deletedUser)
			throw new NotFoundException(`user with id : ${id} not found`);

		return deletedUser;
	}
}