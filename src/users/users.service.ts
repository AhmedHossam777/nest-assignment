import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

	async create(createUserDto: CreateUserDto): Promise<UserDocument> {
		const createdUser = new this.UserModel(createUserDto);
		return createdUser.save();
	}

	async findAll(): Promise<UserDocument[] | null> {
		const users = await this.UserModel.find().exec();

		return users;
	}

	async findById(id: string): Promise<UserDocument | null> {
		const user = await this.UserModel.findById(id).exec();
		if (!user) {
			throw new BadRequestException(`user with id ${id} not found`);
		}

		return user;
	}

	async findByEmail(email: string): Promise<UserDocument | null> {
		const user: UserDocument = await this.UserModel.findOne({ email }).exec();
		if (!user)
			throw new NotFoundException(`user with email : ${email} not found`);

		return user;
	}

	async update(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<UserDocument | null> {
		const newUser: UserDocument = await this.UserModel.findByIdAndUpdate(
			id,
			updateUserDto,
			{
				new: true,
			},
		).exec();
		if (!newUser) throw new NotFoundException(`user with id : ${id} not found`);

		return newUser;
	}

	async remove(id: string): Promise<UserDocument | null> {
		const deletedUser: UserDocument =
			await this.UserModel.findByIdAndDelete(id).exec();
		if (!deletedUser)
			throw new NotFoundException(`user with id : ${id} not found`);

		return deletedUser;
	}
}