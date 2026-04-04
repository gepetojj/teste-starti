import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import {
	DrizzleAsyncProvider,
	type DrizzleDatabase,
} from "src/db/drizzle.provider";
import { commentsTable, postsTable } from "src/db/schema";

import { CreatePostSchema } from "./schemas/create-post.schema";
import { UpdatePostSchema } from "./schemas/update-post.schema";

@Injectable()
export class PostsRepository {
	constructor(
		@Inject(DrizzleAsyncProvider)
		private readonly db: DrizzleDatabase,
	) {}

	async findPostById(id: string) {
		const [post] = await this.db
			.select()
			.from(postsTable)
			.where(eq(postsTable.id, id))
			.limit(1);
		return post ?? null;
	}

	async findCommentsByPostId(postId: string) {
		return this.db
			.select()
			.from(commentsTable)
			.where(eq(commentsTable.postId, postId));
	}

	async createPost(post: CreatePostSchema) {
		const [newPost] = await this.db
			.insert(postsTable)
			.values({
				userId: post.userId,
				text: post.text,
			})
			.returning();

		return newPost;
	}

	async updatePost(id: string, data: Partial<UpdatePostSchema>) {
		const [updatedPost] = await this.db
			.update(postsTable)
			.set(data)
			.where(eq(postsTable.id, id))
			.returning();

		return updatedPost ?? null;
	}

	async archivePost(id: string) {
		const [archivedPost] = await this.db
			.update(postsTable)
			.set({ archived: true })
			.where(eq(postsTable.id, id))
			.returning();

		return archivedPost ?? null;
	}

	async deletePost(id: string) {
		const [deletedPost] = await this.db
			.delete(postsTable)
			.where(eq(postsTable.id, id))
			.returning();

		return deletedPost ?? null;
	}
}
