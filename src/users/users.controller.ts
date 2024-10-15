import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Request,
	NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';
import { UserAuthGuard } from '../auth/guards/auth.guard';
import { log } from 'console';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@UseGuards(UserAuthGuard)
	@Get('/profile')
	async getProfile(@Request() req) {
		const userId = req.user.id;
		console.log(userId);
		const user = await this.usersService.findById(userId);
		if (!user) {
			throw new NotFoundException(`User with id: ${userId} not found`);
		}
		const { password, ...result } = user.toObject();
		return result;
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	// @Get(':id')
	// findOne(@Param('id', MongoIdPipe) id: string) {
	// 	return this.usersService.findOne(id);
	// }

	@Patch(':id')
	update(
		@Param('id', MongoIdPipe) id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id', MongoIdPipe) id: string) {
		return this.usersService.remove(id);
	}
}
