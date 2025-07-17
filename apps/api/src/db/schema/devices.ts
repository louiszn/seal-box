import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const devicesTable = pgTable("devices", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	lastSeenAt: timestamp("last_seen_at", { mode: "date" }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
