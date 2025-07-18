import { FastifyReply, FastifyRequest } from "fastify";

import { eq } from "drizzle-orm";
import db from "../../db/index.js";

import { usersTable } from "../../db/schema/users.js";

import { APIUser } from "@seal-box/types";

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

	reply.status(200).send({
		id: user.id,
		email: user.email,
		createdAt: user.createdAt.getTime(),
	} satisfies APIUser);
}
