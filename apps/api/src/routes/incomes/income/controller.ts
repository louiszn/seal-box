import { FastifyReply, FastifyRequest } from "fastify";
import { toAPIIncome } from "../transfer.js";
import { modifyIncomeSchema } from "./schema.js";
import db from "../../../db/index.js";
import { and, eq } from "drizzle-orm";
import { categoriesTable } from "../../../db/schema/categories.js";
import { incomesTable } from "../../../db/schema/incomes.js";

export function getIncomeHandler(request: FastifyRequest, reply: FastifyReply) {
	const { income } = request;

	if (!income) {
		return;
	}

	reply.send(toAPIIncome(income));
}

export async function modifyIncomeHandler(request: FastifyRequest, reply: FastifyReply) {
	const { income, user } = request;

	if (!income || !user) {
		return;
	}

	const parseResult = await modifyIncomeSchema.safeParseAsync(request.body);

	if (!parseResult.success) {
		reply.status(400).send({
			error: parseResult.error.issues,
		});

		return;
	}

	const { amount, title, description, receivedAt, categoryId } = parseResult.data;

	if (categoryId) {
		const [category] = await db
			.select()
			.from(categoriesTable)
			.where(and(eq(categoriesTable.id, categoryId), eq(categoriesTable.userId, user.id)));

		if (!category) {
			reply.status(404).send({
				error: "Unknown category",
			});

			return;
		}
	}

	const [newIncome] = await db
		.update(incomesTable)
		.set({
			amount,
			title,
			description,
			categoryId,
			...(receivedAt ? { receivedAt: new Date(receivedAt) } : {}),
		})
		.where(eq(incomesTable.id, income.id))
		.returning();

	reply.send(toAPIIncome(newIncome));
}

export async function deleteIncomeHandler(request: FastifyRequest, reply: FastifyReply) {
	const { income } = request;

	if (!income) {
		return;
	}

	await db.delete(incomesTable).where(eq(incomesTable.id, income.id));

	reply.status(204).send();
}
