import { FastifyReply, FastifyRequest } from "fastify";
import { usersTable } from "../../../db/schema/users.js";
import { and, eq, InferSelectModel } from "drizzle-orm";
import { categoriesTable } from "../../../db/schema/categories.js";
import db from "../../../db/index.js";

export async function requireCategoryExists(
	request: FastifyRequest<{ Params: { categoryId: string } }>,
	reply: FastifyReply,
) {
	const { categoryId } = request.params;

	const user = request.getDecorator<InferSelectModel<typeof usersTable>>("user");

	const [category] = await db
		.select()
		.from(categoriesTable)
		.where(and(eq(categoriesTable.userId, user.id), eq(categoriesTable.id, categoryId)));

	if (!category) {
		await reply.status(404).send({
			error: "Unknown category",
		});

		return;
	}

	request.setDecorator("category", category);
}
