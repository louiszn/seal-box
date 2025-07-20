import { InferSelectModel } from "drizzle-orm";
import { usersTable } from "../db/schema/users.js";
import { devicesTable } from "../db/schema/devices.js";
import { categoriesTable } from "../db/schema/categories.js";

declare module "fastify" {
	interface FastifyRequest {
		user?: InferSelectModel<typeof usersTable>;
		device?: InferSelectModel<typeof devicesTable>;
		category?: InferSelectModel<typeof categoriesTable>;
	}
}

export {};
