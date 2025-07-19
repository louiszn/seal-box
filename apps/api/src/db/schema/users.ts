import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { MAX_SNOWFLAKE_LENGTH } from "@seal-box/libs";

export const usersTable = pgTable("users", {
	id: varchar("id", { length: MAX_SNOWFLAKE_LENGTH }).notNull().primaryKey(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	createdAt: timestamp("created_at").notNull(),
});
