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

import { PostsService } from "./posts.service";
import { ArchivePostResponse } from "./responses/archive-post.response";
import { CreatePostResponse } from "./responses/create-post.response";
import { GetPostResponse } from "./responses/get-post.response";
import { ListPostCommentsResponse } from "./responses/list-post-comments.response";
import { UpdatePostResponse } from "./responses/update-post.response";
import { CreatePostSchema } from "./schemas/create-post.schema";
import { UpdatePostSchema } from "./schemas/update-post.schema";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
	constructor(private readonly service: PostsService) {}

	@Post()
	@ApiOperation({ summary: "Cria uma nova publicação" })
	@ZodResponse({ type: CreatePostResponse, status: HttpStatus.CREATED })
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao criar publicação",
	})
	async createPost(@Body() body: CreatePostSchema) {
		const post = await this.service.createPost(body);
		return {
			id: post.id,
			userId: post.userId,
			text: post.text,
			archived: post.archived,
			createdAt: post.createdAt.toISOString(),
		};
	}

	@Get(":id/comments")
	@ApiOperation({
		summary: "Lista todos os comentários de uma publicação",
	})
	@ZodResponse({ type: ListPostCommentsResponse, status: HttpStatus.OK })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Publicação não encontrada",
	})
	async listPostComments(@Param("id") id: string) {
		z.string().refine(isValidSemanticId).parse(id);

		const comments = await this.service.listPostComments(id);
		return comments.map((comment) => ({
			id: comment.id,
			userId: comment.userId,
			postId: comment.postId,
			message: comment.message,
			createdAt: comment.createdAt.toISOString(),
			updatedAt: comment.updatedAt.toISOString(),
		}));
	}

	@Get(":id")
	@ApiOperation({ summary: "Busca uma publicação pelo ID" })
	@ZodResponse({ type: GetPostResponse, status: HttpStatus.OK })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Publicação não encontrada",
	})
	async getPostById(@Param("id") id: string) {
		z.string().refine(isValidSemanticId).parse(id);

		const post = await this.service.getPostById(id);
		return {
			id: post.id,
			userId: post.userId,
			text: post.text,
			archived: post.archived,
			createdAt: post.createdAt.toISOString(),
			updatedAt: post.updatedAt.toISOString(),
		};
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualiza uma publicação" })
	@ZodResponse({ type: UpdatePostResponse, status: HttpStatus.OK })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Publicação não encontrada",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao atualizar publicação",
	})
	async updatePost(@Param("id") id: string, @Body() body: UpdatePostSchema) {
		z.string().refine(isValidSemanticId).parse(id);

		const post = await this.service.updatePost(id, body);
		return {
			id: post.id,
			userId: post.userId,
			text: post.text,
			archived: post.archived,
			updatedAt: post.updatedAt.toISOString(),
		};
	}

	@Put(":id/archive")
	@ApiOperation({ summary: "Arquiva uma publicação" })
	@ZodResponse({ type: ArchivePostResponse, status: HttpStatus.OK })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Publicação não encontrada",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao arquivar publicação",
	})
	async archivePost(@Param("id") id: string) {
		z.string().refine(isValidSemanticId).parse(id);

		const post = await this.service.archivePost(id);
		return {
			id: post.id,
			archived: post.archived,
			updatedAt: post.updatedAt.toISOString(),
		};
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Apaga uma publicação" })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: "Publicação deletada com sucesso",
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Publicação não encontrada",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao deletar publicação",
	})
	async deletePost(@Param("id") id: string) {
		z.string().refine(isValidSemanticId).parse(id);

		await this.service.deletePost(id);
	}
}
