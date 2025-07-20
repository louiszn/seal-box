import { FastifyReply, FastifyRequest } from "fastify";
import { toAPIExpense } from "../transfer.js";
import { modifyExpenseSchema } from "./schema.js";
import db from "../../../db/index.js";
import { and, eq } from "drizzle-orm";
import { categoriesTable } from "../../../db/schema/categories.js";
import { expensesTable } from "../../../db/schema/expenses.js";
import { CategoryType } from "@seal-box/enums";

export function getExpenseHandler(request: FastifyRequest, reply: FastifyReply) {
	const { expense } = request;

	if (!expense) {
		return;
	}

	reply.send(toAPIExpense(expense));
}

export async function modifyExpenseHandler(request: FastifyRequest, reply: FastifyReply) {
	const { expense, user } = request;

	if (!expense || !user) {
		return;
	}

	const parseResult = await modifyExpenseSchema.safeParseAsync(request.body);

	if (!parseResult.success) {
		reply.status(400).send({
			error: parseResult.error.issues,
		});

		return;
	}

	const { amount, title, description, spentAt, categoryId } = parseResult.data;

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

	const [newExpense] = await db
		.update(expensesTable)
		.set({
			amount,
			title,
			description,
			categoryId,
			...(spentAt ? { spentAt: new Date(spentAt) } : {}),
		})
		.where(eq(expensesTable.id, expense.id))
		.returning();

	reply.send(toAPIExpense(newExpense));
}

export async function deleteExpenseHandler(request: FastifyRequest, reply: FastifyReply) {
	const { expense } = request;

	if (!expense) {
		return;
	}

	await db.delete(expensesTable).where(eq(expensesTable.id, expense.id));

	reply.status(204).send();
}
