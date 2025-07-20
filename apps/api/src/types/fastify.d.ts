import { InferSelectModel } from "drizzle-orm";
import {
	usersTable,
	devicesTable,
	categoriesTable,
	incomesTable,
	expensesTable,
} from "../db/schema/index.js";

declare module "fastify" {
	interface FastifyRequest {
		user?: InferSelectModel<typeof usersTable>;
		device?: InferSelectModel<typeof devicesTable>;
		category?: InferSelectModel<typeof categoriesTable>;
		income?: InferSelectModel<typeof incomesTable>;
		expense?: InferSelectModel<typeof expensesTable>;
	}
}

export {};
