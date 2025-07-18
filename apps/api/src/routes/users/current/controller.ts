import { FastifyReply, FastifyRequest } from "fastify";

import { eq, InferSelectModel } from "drizzle-orm";

import { usersTable } from "../../../db/schema/users.js";

import { APIUser } from "@seal-box/types";
import { modifyCurrentUserSchema } from "./schema.js";

import db from "../../../db/index.js";

export async function getCurrentUserHandler(request: FastifyRequest, reply: FastifyReply) {
	const user = request.getDecorator<InferSelectModel<typeof usersTable>>("user");

	reply.status(200).send({
		id: user.id,
		email: user.email,
		createdAt: user.createdAt.getTime(),
	} satisfies APIUser);
}

export async function modifyCurrentUserHandler(request: FastifyRequest, reply: FastifyReply) {
	const user = request.getDecorator<InferSelectModel<typeof usersTable>>("user");

	const payload = await modifyCurrentUserSchema.safeParseAsync(request.body);

	if (!payload.success) {
		reply.status(400).send({
			error: payload.error.issues,
		});

		return;
	}

	const { data } = payload;

	const [newUser] = await db
		.update(usersTable)
		.set(data)
		.where(eq(usersTable.id, user.id))
		.returning();

	reply.status(200).send({
		id: newUser.id,
		email: newUser.email,
		createdAt: newUser.createdAt.getTime(),
	} satisfies APIUser);
}
