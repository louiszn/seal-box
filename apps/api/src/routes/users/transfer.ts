import { InferSelectModel } from "drizzle-orm";
import { usersTable } from "../../db/schema/index.js";
import { APIUser } from "@seal-box/types";

export function toAPIUser(user: InferSelectModel<typeof usersTable>): APIUser {
	return {
		id: user.id,
		email: user.email,
		createdAt: user.createdAt.getTime(),
	};
}
