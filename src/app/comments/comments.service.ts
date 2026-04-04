import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from "@nestjs/common";

import { CommentsRepository } from "./comments.repository";
import { CreateCommentSchema } from "./schemas/create-comment.schema";
import { UpdateCommentSchema } from "./schemas/update-comment.schema";

@Injectable()
export class CommentsService {
	private readonly logger = new Logger(CommentsService.name);
	constructor(private readonly repository: CommentsRepository) {}

	async createComment(data: CreateCommentSchema) {
		try {
			return this.repository.createComment(data);
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException("Erro ao criar comentário");
		}
	}

	async updateComment(id: string, data: UpdateCommentSchema) {
		await this.getCommentById(id);

		try {
			const updatedComment = await this.repository.updateComment(
				id,
				data,
			);
			return updatedComment;
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException(
				"Erro ao atualizar comentário",
			);
		}
	}

	async deleteComment(id: string) {
		await this.getCommentById(id);

		try {
			await this.repository.deleteComment(id);
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException(
				"Erro ao deletar comentário",
			);
		}
	}

	async getCommentById(id: string) {
		const comment = await this.repository.findCommentById(id);

		if (!comment) {
			throw new NotFoundException("Comentário não encontrado");
		}

		return comment;
	}
}
