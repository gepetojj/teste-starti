import { Body, Controller, Post } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";

import { CreateUserResponse } from "./responses/create-user.response";
import { CreateUserSchema } from "./schemas/create-user.schema";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly service: UsersService) {}

	@Post()
	@ZodResponse({ type: CreateUserResponse })
	async createUser(@Body() body: CreateUserSchema) {
		const user = await this.service.createUser(body);
		return {
			id: user.id,
			username: user.username,
		};
	}
}
