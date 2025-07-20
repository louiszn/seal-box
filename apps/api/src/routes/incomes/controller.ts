import { FastifyReply, FastifyRequest } from "fastify";

import { categoriesTable, incomesTable } from "../../db/schema/index.js";
import db from "../../db/index.js";
import { and, eq } from "drizzle-orm";
import { toAPIIncome } from "./transfer.js";
import { createIncomeSchema } from "./schema.js";
import { generateId } from "@seal-box/libs";
import { CategoryType } from "@seal-box/enums";

export async function getIncomesHandler(request: FastifyRequest, reply: FastifyReply) {
	const { user } = request;

	if (!user) {
		return;
	}

	const incomes = await db.select().from(incomesTable).where(eq(incomesTable.userId, user.id));

	reply.send(incomes.map(toAPIIncome));
}

export async function createIncomeHandler(request: FastifyRequest, reply: FastifyReply) {
	const { user } = request;

	if (!user) {
		return;
	}

	const parseResult = await createIncomeSchema.safeParseAsync(request.body);

	if (!parseResult.success) {
		reply.status(400).send({
			error: parseResult.error.issues,
		});

		return;
	}

	const { title, description, amount, receivedAt, categoryId } = parseResult.data;

	if (categoryId) {
		const [category] = await db
			.select()
			.from(categoriesTable)
			.where(
				and(
					eq(categoriesTable.id, categoryId),
					eq(categoriesTable.type, CategoryType.Income),
					eq(categoriesTable.userId, user.id),
				),
			);

		if (!category) {
			reply.status(404).send({
				error: "Unknown category",
			});

			return;
		}
	}

	const createdAt = new Date();

	const [income] = await db
		.insert(incomesTable)
		.values({
			id: generateId(createdAt),
			title,
			description: description || null,
			amount,
			categoryId,
			userId: user.id,
			receivedAt: new Date(receivedAt),
			createdAt,
		})
		.returning();

	reply.send(toAPIIncome(income));
}
