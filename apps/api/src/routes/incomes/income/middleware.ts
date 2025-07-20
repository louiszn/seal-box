import { FastifyReply, FastifyRequest } from "fastify";
import { and, eq } from "drizzle-orm";

import db from "../../../db/index.js";
import { incomesTable } from "../../../db/schema/index.js";

export async function requireIncomeExists(
	request: FastifyRequest<{ Params: { incomeId: string } }>,
	reply: FastifyReply,
) {
	const { user } = request;

	if (!user) {
		return;
	}

	const { incomeId } = request.params;

	const [income] = await db
		.select()
		.from(incomesTable)
		.where(and(eq(incomesTable.id, incomeId), eq(incomesTable.userId, user.id)));

	if (!income) {
		reply.status(404).send({
			error: "Unknown income",
		});

		return;
	}

	request.income = income;
}
