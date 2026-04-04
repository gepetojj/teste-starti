import {
	Body,
	Controller,
	Delete,
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

import { CommentsService } from "./comments.service";
import { CreateCommentResponse } from "./responses/create-comment.response";
import { UpdateCommentResponse } from "./responses/update-comment.response";
import { CreateCommentSchema } from "./schemas/create-comment.schema";
import { UpdateCommentSchema } from "./schemas/update-comment.schema";

@ApiTags("Comments")
@Controller("comments")
export class CommentsController {
	constructor(private readonly service: CommentsService) {}

	@Post()
	@ApiOperation({ summary: "Cria um novo comentário" })
	@ZodResponse({ type: CreateCommentResponse, status: HttpStatus.CREATED })
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao criar comentário",
	})
	async createComment(@Body() body: CreateCommentSchema) {
		const comment = await this.service.createComment(body);
		return {
			id: comment.id,
			userId: comment.userId,
			postId: comment.postId,
			message: comment.message,
			createdAt: comment.createdAt.toISOString(),
		};
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualiza um comentário" })
	@ZodResponse({ type: UpdateCommentResponse, status: HttpStatus.OK })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Comentário não encontrado",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao atualizar comentário",
	})
	async updateComment(
		@Param("id") id: string,
		@Body() body: UpdateCommentSchema,
	) {
		z.string().refine(isValidSemanticId).parse(id);

		const comment = await this.service.updateComment(id, body);
		return {
			id: comment.id,
			userId: comment.userId,
			postId: comment.postId,
			message: comment.message,
			updatedAt: comment.updatedAt.toISOString(),
		};
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Apaga um comentário" })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: "Comentário deletado com sucesso",
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Comentário não encontrado",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Erro ao deletar comentário",
	})
	async deleteComment(@Param("id") id: string) {
		z.string().refine(isValidSemanticId).parse(id);

		await this.service.deleteComment(id);
	}
}
