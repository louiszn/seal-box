import { InferSelectModel } from "drizzle-orm";
import { categoriesTable } from "../../db/schema/index.js";
import { APICategory } from "@seal-box/types";

export function toAPICategory(category: InferSelectModel<typeof categoriesTable>): APICategory {
	return {
		id: category.id,
		name: category.name,
		description: category.description,
		type: category.type,
		createdAt: category.createdAt.getTime(),
	};
}
