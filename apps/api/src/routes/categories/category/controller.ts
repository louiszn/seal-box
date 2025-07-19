import { FastifyReply, FastifyRequest } from "fastify";
import { eq, InferSelectModel } from "drizzle-orm";

import { toAPICategory } from "../transfer.js";
import { modifyCategorySchema } from "./schema.js";

import { categoriesTable } from "../../../db/schema/categories.js";
import db from "../../../db/index.js";

export function getCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
	const category = request.getDecorator<InferSelectModel<typeof categoriesTable>>("category");

	reply.send(toAPICategory(category));
}

export async function modifyCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
	const parseResult = await modifyCategorySchema.safeParseAsync(request.body);

	if (!parseResult.success) {
		reply.status(400).send({
			error: parseResult.error.issues,
		});

		return;
	}

	const category = request.getDecorator<InferSelectModel<typeof categoriesTable>>("category");

	const { name, description } = parseResult.data;

	const [newCategory] = await db
		.update(categoriesTable)
		.set({
			name,
			description,
		})
		.where(eq(categoriesTable.id, category.id))
		.returning();

	reply.send(toAPICategory(newCategory));
}

export async function deleteCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
	const category = request.getDecorator<InferSelectModel<typeof categoriesTable>>("category");

	await db.delete(categoriesTable).where(eq(categoriesTable.id, category.id));

	reply.status(204).send();
}
