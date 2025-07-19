import { FastifyReply, FastifyRequest } from "fastify";

import { eq, InferSelectModel } from "drizzle-orm";

import db from "../../db/index.js";
import { categoriesTable } from "../../db/schema/categories.js";
import { usersTable } from "../../db/schema/users.js";

import { createCategorySchema } from "./schema.js";
import { toAPICategory } from "./transfer.js";

import { generateId } from "@seal-box/libs";

export async function getCategoriesHandler(request: FastifyRequest, reply: FastifyReply) {
	const user = request.getDecorator<InferSelectModel<typeof usersTable>>("user");

	const categories = await db
		.select()
		.from(categoriesTable)
		.where(eq(categoriesTable.userId, user.id));

	reply.send(
		categories.map((cat) => toAPICategory(cat)), // meow
	);
}

export async function createCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
	const parseResult = await createCategorySchema.safeParseAsync(request.body);

	if (!parseResult.success) {
		reply.status(400).send({
			error: parseResult.error.issues,
		});

		return;
	}

	const user = request.getDecorator<InferSelectModel<typeof usersTable>>("user");

	const { name, description, type } = parseResult.data;

	const createdAt = new Date();

	const [category] = await db
		.insert(categoriesTable)
		.values({
			id: generateId(createdAt),
			userId: user.id,
			name,
			description,
			type,
			createdAt,
		})
		.returning();

	reply.send(toAPICategory(category));
}
