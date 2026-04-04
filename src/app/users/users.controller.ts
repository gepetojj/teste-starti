import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { CreateUserResponse } from "./responses/create-user.response";
import { CreateUserSchema } from "./schemas/create-user.schema";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
	constructor(private readonly service: UsersService) {}

	@Post()
	@ApiOperation({ summary: "Cria um novo usuário" })
	@ZodResponse({ type: CreateUserResponse, status: HttpStatus.CREATED })
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: "Nome de usuário e/ou email já existem",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao criar usuário",
	})
	async createUser(@Body() body: CreateUserSchema) {
		const user = await this.service.createUser(body);
		return {
			id: user.id,
			username: user.username,
		};
	}
}
