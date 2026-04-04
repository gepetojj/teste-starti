import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import {
	DrizzleAsyncProvider,
	type DrizzleDatabase,
} from "src/db/drizzle.provider";
import { usersTable } from "src/db/schema";

import { CreateUserSchema } from "./schemas/create-user.schema";

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
}
