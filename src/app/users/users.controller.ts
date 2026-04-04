import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { isValidSemanticId } from "src/lib/semantic-id";
import z from "zod";

import { CreateUserResponse } from "./responses/create-user.response";
import { GetUserResponse } from "./responses/get-user.response";
import { ListCommentsFromPublicPostsResponse } from "./responses/list-comments-from-public-posts.response";
import { ListPublicPostsResponse } from "./responses/list-public-posts.response";
import { UpdateUserResponse } from "./responses/update-user.response";
import { CreateUserSchema } from "./schemas/create-user.schema";
import { UpdateUserSchema } from "./schemas/update-user.schema";
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

	@Get(":id/posts")
	@ApiOperation({ summary: "Lista todos os posts públicos de um usuário" })
	@ZodResponse({ type: ListPublicPostsResponse, status: HttpStatus.OK })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Usuário não encontrado",
	})
	async listPublicPosts(@Param("id") id: string) {
		z.string().refine(isValidSemanticId).parse(id);

		const posts = await this.service.getPublicPostsByUserId(id);
		return posts.map((post) => ({
			id: post.id,
			userId: post.userId,
			text: post.text,
			createdAt: post.createdAt.toISOString(),
			updatedAt: post.updatedAt.toISOString(),
		}));
	}

	@Get(":id/comments")
	@ApiOperation({
		summary: "Lista todos os comentários de um usuário em posts públicos",
	})
	@ZodResponse({
		type: ListCommentsFromPublicPostsResponse,
		status: HttpStatus.OK,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Usuário não encontrado",
	})
	async listCommentsFromPublicPosts(@Param("id") id: string) {
		z.string().refine(isValidSemanticId).parse(id);

		const comments =
			await this.service.getCommentsFromPublicPostsByUserId(id);
		return comments.map((comment) => ({
			id: comment.comments.id,
			userId: comment.comments.userId,
			postId: comment.comments.postId,
			message: comment.comments.message,
			createdAt: comment.comments.createdAt.toISOString(),
			updatedAt: comment.comments.updatedAt.toISOString(),
		}));
	}

	@Get(":id")
	@ApiOperation({ summary: "Busca um usuário pelo ID" })
	@ZodResponse({ type: GetUserResponse, status: HttpStatus.OK })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Usuário não encontrado",
	})
	async getUserById(@Param("id") id: string) {
		z.string().refine(isValidSemanticId).parse(id);

		const user = await this.service.getUserById(id);
		return {
			id: user.id,
			username: user.username,
			name: user.name,
			email: user.email,
			biography: user.biography,
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString(),
		};
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualiza um usuário" })
	@ZodResponse({ type: UpdateUserResponse, status: HttpStatus.OK })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Usuário não encontrado",
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: "Nome de usuário e/ou email já existem",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao atualizar usuário",
	})
	async updateUser(@Param("id") id: string, @Body() body: UpdateUserSchema) {
		z.string().refine(isValidSemanticId).parse(id);

		const user = await this.service.updateUser(id, body);
		return {
			id: user.id,
			username: user.username,
			name: user.name,
			email: user.email,
			biography: user.biography,
			updatedAt: user.updatedAt.toISOString(),
		};
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Apaga um usuário" })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: "Usuário deletado com sucesso",
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Usuário não encontrado",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao deletar usuário",
	})
	async deleteUser(@Param("id") id: string) {
		z.string().refine(isValidSemanticId).parse(id);

		await this.service.deleteUser(id);
	}
}
