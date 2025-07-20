import { FastifyReply, FastifyRequest } from "fastify";

import { eq } from "drizzle-orm";
import db from "../../db/index.js";

import { usersTable } from "../../db/schema/index.js";

import { toAPIUser } from "./transfer.js";

export async function getUserByIdHandler(
	request: FastifyRequest<{ Params: { userId: string } }>,
	reply: FastifyReply,
) {
	const { userId } = request.params;

	const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

	if (!user) {
		reply.status(404).send({
			error: "Unknown user",
		});

		return;
	}

	reply.status(200).send(toAPIUser(user));
}
