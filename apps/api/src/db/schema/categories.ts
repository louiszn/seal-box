import { MAX_SNOWFLAKE_LENGTH } from "@seal-box/libs";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const categoriesTable = pgTable("categories", {
	id: varchar("id", { length: MAX_SNOWFLAKE_LENGTH }).notNull().primaryKey(),
	userId: varchar("user_id", { length: MAX_SNOWFLAKE_LENGTH })
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 50 }).notNull(),
	type: integer("type").notNull(),
	description: varchar("description", { length: 500 }),
	createdAt: timestamp("created_at").notNull(),
});
