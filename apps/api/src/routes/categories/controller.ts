import { FastifyReply, FastifyRequest } from "fastify";
import { usersTable } from "../../db/schema/users.js";
import { eq, InferSelectModel } from "drizzle-orm";
import { categoriesTable } from "../../db/schema/categories.js";
import db from "../../db/index.js";
import { APICategory } from "@seal-box/types";
import { createCategorySchema } from "./schema.js";
import { generateId } from "@seal-box/libs";

export async function getCategoriesHandler(request: FastifyRequest, reply: FastifyReply) {
	const user = request.getDecorator<InferSelectModel<typeof usersTable>>("user");

	const categories = await db
		.select()
		.from(categoriesTable)
		.where(eq(categoriesTable.userId, user.id));

	reply.send(
		// meow
		categories.map((cat) => {
			return {
				id: cat.id,
				name: cat.name,
				description: cat.description,
				type: cat.type,
				createdAt: cat.createdAt.getTime(),
			} satisfies APICategory;
		}),
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

	reply.send({
		id: category.id,
		name: category.name,
		description: category.description,
		type: category.type,
		createdAt: category.createdAt.getTime(),
	} satisfies APICategory);
}
