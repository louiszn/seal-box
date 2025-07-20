import { FastifyReply, FastifyRequest } from "fastify";
import { and, eq } from "drizzle-orm";

import db from "../../../db/index.js";
import { expensesTable } from "../../../db/schema/index.js";

export async function requireExpenseExists(
	request: FastifyRequest<{ Params: { expenseId: string } }>,
	reply: FastifyReply,
) {
	const { user } = request;

	if (!user) {
		return;
	}

	const { expenseId } = request.params;

	const [expense] = await db
		.select()
		.from(expensesTable)
		.where(and(eq(expensesTable.id, expenseId), eq(expensesTable.userId, user.id)));

	if (!expense) {
		reply.status(404).send({
			error: "Unknown expense",
		});

		return;
	}

	request.expense = expense;
}
