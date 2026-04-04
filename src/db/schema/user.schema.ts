import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { semanticId } from "src/lib/semantic-id";

export const usersTable = pgTable("users", {
	id: text()
		.primaryKey()
		.$default(() => semanticId("user")),
	username: text().notNull().unique(),
	name: text().notNull(),
	email: text().notNull().unique(),
	password: text().notNull(),
	biography: text(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});
