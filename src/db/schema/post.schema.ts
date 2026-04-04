import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { semanticId } from "src/lib/semantic-id";

import { usersTable } from ".";

export const postsTable = pgTable("posts", {
	id: text()
		.primaryKey()
		.$default(() => semanticId("post")),
	userId: text().references(() => usersTable.id, { onDelete: "set null" }),
	text: text().notNull(),
	archived: boolean().notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const postRelations = relations(postsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [postsTable.userId],
		references: [usersTable.id],
	}),
}));
