import { FastifyReply, FastifyRequest } from "fastify";

import { InferSelectModel } from "drizzle-orm";

import { usersTable } from "../../../db/schema/users.js";

import { APIUser } from "@seal-box/types";

export async function getCurrentUser(
	request: FastifyRequest<{ Params: { userId: string } }>,
	reply: FastifyReply,
) {
	const user = request.getDecorator<InferSelectModel<typeof usersTable>>("user");

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
