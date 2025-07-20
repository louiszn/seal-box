import { MAX_SNOWFLAKE_LENGTH } from "@seal-box/libs";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { categoriesTable } from "./categories.js";

export const expensesTable = pgTable("expenses", {
	id: varchar("id", { length: MAX_SNOWFLAKE_LENGTH }).notNull().primaryKey(),
	userId: varchar("user_id", { length: MAX_SNOWFLAKE_LENGTH })
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	categoryId: varchar("category_id", { length: MAX_SNOWFLAKE_LENGTH }).references(
		() => categoriesTable.id,
		{ onDelete: "set null" },
	),
	title: varchar("title", { length: 50 }).notNull(),
	description: varchar("description", { length: 255 }),
	amount: integer("amount").notNull(),
	spentAt: timestamp("spent_at").notNull(),
	createdAt: timestamp("created_at").notNull(),
});
