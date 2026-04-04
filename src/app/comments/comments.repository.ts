import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import {
	DrizzleAsyncProvider,
	type DrizzleDatabase,
} from "src/db/drizzle.provider";
import { commentsTable } from "src/db/schema";

import { CreateCommentSchema } from "./schemas/create-comment.schema";
import { UpdateCommentSchema } from "./schemas/update-comment.schema";

@Injectable()
export class CommentsRepository {
	constructor(
		@Inject(DrizzleAsyncProvider)
		private readonly db: DrizzleDatabase,
	) {}

	async findCommentById(id: string) {
		const [comment] = await this.db
			.select()
			.from(commentsTable)
			.where(eq(commentsTable.id, id))
			.limit(1);
		return comment ?? null;
	}

	async createComment(comment: CreateCommentSchema) {
		const [newComment] = await this.db
			.insert(commentsTable)
			.values({
				userId: comment.userId,
				postId: comment.postId,
				message: comment.message,
			})
			.returning();

		return newComment;
	}

	async updateComment(id: string, data: Partial<UpdateCommentSchema>) {
		const [updatedComment] = await this.db
			.update(commentsTable)
			.set(data)
			.where(eq(commentsTable.id, id))
			.returning();

		return updatedComment ?? null;
	}

	async deleteComment(id: string) {
		const [deletedComment] = await this.db
			.delete(commentsTable)
			.where(eq(commentsTable.id, id))
			.returning();

		return deletedComment ?? null;
	}
}
