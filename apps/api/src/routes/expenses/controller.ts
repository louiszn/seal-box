import { FastifyReply, FastifyRequest } from "fastify";

import { categoriesTable, expensesTable } from "../../db/schema/index.js";
import db from "../../db/index.js";
import { and, eq } from "drizzle-orm";
import { toAPIExpense } from "./transfer.js";
import { createExpenseSchema } from "./schema.js";
import { generateId } from "@seal-box/libs";
import { CategoryType } from "@seal-box/enums";

export async function getExpensesHandler(request: FastifyRequest, reply: FastifyReply) {
	const { user } = request;

	if (!user) {
		return;
	}

	const expenses = await db.select().from(expensesTable).where(eq(expensesTable.userId, user.id));

	reply.send(expenses.map(toAPIExpense));
}

export async function createExpenseHandler(request: FastifyRequest, reply: FastifyReply) {
	const { user } = request;

	if (!user) {
		return;
	}

	const parseResult = await createExpenseSchema.safeParseAsync(request.body);

	if (!parseResult.success) {
		reply.status(400).send({
			error: parseResult.error.issues,
		});

		return;
	}

	const { title, description, amount, spentAt, categoryId } = parseResult.data;

	if (categoryId) {
		const [category] = await db
			.select()
			.from(categoriesTable)
			.where(
				and(
					eq(categoriesTable.id, categoryId),
					eq(categoriesTable.type, CategoryType.Expense),
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

	const [expense] = await db
		.insert(expensesTable)
		.values({
			id: generateId(createdAt),
			title,
			description: description || null,
			amount,
			categoryId,
			userId: user.id,
			spentAt: new Date(spentAt),
			createdAt,
		})
		.returning();

	reply.send(toAPIExpense(expense));
}
