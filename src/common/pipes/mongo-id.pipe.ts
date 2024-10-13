import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform<string> {
	transform(value: string): string {
		if (!isValidObjectId(value))
			throw new BadRequestException(`${value} is not a valid MongoDB ObjectId`);

		return value;
	}
}