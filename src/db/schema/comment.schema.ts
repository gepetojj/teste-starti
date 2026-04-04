import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { semanticId } from "src/lib/semantic-id";

import { postsTable, usersTable } from ".";

export const commentsTable = pgTable("comments", {
	id: text()
		.primaryKey()
		.$default(() => semanticId("comment")),
	userId: text().references(() => usersTable.id, { onDelete: "set null" }),
	postId: text()
		.notNull()
		.references(() => postsTable.id, { onDelete: "cascade" }),
	message: text().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const commentRelations = relations(commentsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [commentsTable.userId],
		references: [usersTable.id],
	}),
	post: one(postsTable, {
		fields: [commentsTable.postId],
		references: [postsTable.id],
	}),
}));
