import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import {
	DrizzleAsyncProvider,
	type DrizzleDatabase,
} from "src/db/drizzle.provider";
import { commentsTable, postsTable, usersTable } from "src/db/schema";

import { CreateUserSchema } from "./schemas/create-user.schema";
import { UpdateUserSchema } from "./schemas/update-user.schema";

@Injectable()
export class UsersRepository {
	constructor(
		@Inject(DrizzleAsyncProvider)
		private readonly db: DrizzleDatabase,
	) {}

	async findUserByUsername(username: string) {
		const [user] = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.username, username))
			.limit(1);
		return user ?? null;
	}

	async findUserByEmail(email: string) {
		const [user] = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.limit(1);
		return user ?? null;
	}

	async findPublicPostsByUserId(userId: string) {
		const posts = await this.db
			.select()
			.from(postsTable)
			.where(
				and(
					eq(postsTable.userId, userId),
					eq(postsTable.archived, false),
				),
			);
		return posts;
	}

	async findCommentsFromPublicPostsByUserId(userId: string) {
		const comments = await this.db
			.select()
			.from(commentsTable)
			.innerJoin(postsTable, eq(commentsTable.postId, postsTable.id))
			.where(
				and(
					eq(postsTable.userId, userId),
					eq(postsTable.archived, false),
				),
			);
		return comments;
	}

	async findUserById(id: string) {
		const [user] = await this.db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id))
			.limit(1);
		return user ?? null;
	}

	async createUser(user: CreateUserSchema) {
		const [newUser] = await this.db
			.insert(usersTable)
			.values({
				username: user.username,
				name: user.name,
				email: user.email,
				password: user.password,
				biography: user.biography,
			})
			.returning();

		return newUser;
	}

	async updateUser(id: string, data: Partial<UpdateUserSchema>) {
		const [updatedUser] = await this.db
			.update(usersTable)
			.set(data)
			.where(eq(usersTable.id, id))
			.returning();

		return updatedUser ?? null;
	}

	async deleteUser(id: string) {
		const [deletedUser] = await this.db
			.delete(usersTable)
			.where(eq(usersTable.id, id))
			.returning();

		return deletedUser ?? null;
	}
}
