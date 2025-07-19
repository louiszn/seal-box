import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { MAX_SNOWFLAKE_LENGTH } from "@seal-box/libs";

export const devicesTable = pgTable("devices", {
	id: varchar("id", { length: MAX_SNOWFLAKE_LENGTH }).notNull().primaryKey(),
	userId: varchar("user_id", { length: MAX_SNOWFLAKE_LENGTH })
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	lastSeenAt: timestamp("last_seen_at", { mode: "date" }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
});
