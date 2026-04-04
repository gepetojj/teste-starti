import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from "@nestjs/common";

import { PostsRepository } from "./posts.repository";
import { CreatePostSchema } from "./schemas/create-post.schema";
import { UpdatePostSchema } from "./schemas/update-post.schema";

@Injectable()
export class PostsService {
	private readonly logger = new Logger(PostsService.name);
	constructor(private readonly repository: PostsRepository) {}

	async createPost(data: CreatePostSchema) {
		try {
			return this.repository.createPost(data);
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException("Erro ao criar publicação");
		}
	}

	async getPostById(id: string) {
		const post = await this.repository.findPostById(id);

		if (!post) {
			throw new NotFoundException("Publicação não encontrada");
		}

		return post;
	}

	async updatePost(id: string, data: UpdatePostSchema) {
		await this.getPostById(id);

		try {
			const updatedPost = await this.repository.updatePost(id, data);
			return updatedPost;
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException(
				"Erro ao atualizar publicação",
			);
		}
	}

	async archivePost(id: string) {
		await this.getPostById(id);

		try {
			const archivedPost = await this.repository.archivePost(id);
			return archivedPost;
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException(
				"Erro ao arquivar publicação",
			);
		}
	}

	async deletePost(id: string) {
		await this.getPostById(id);

		try {
			await this.repository.deletePost(id);
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException(
				"Erro ao deletar publicação",
			);
		}
	}

	async listPostComments(postId: string) {
		await this.getPostById(postId);
		return this.repository.findCommentsByPostId(postId);
	}
}
