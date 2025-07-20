import { FastifyReply, FastifyRequest } from "fastify";

import { eq } from "drizzle-orm";

import { usersTable } from "../../../db/schema/index.js";

import { modifyCurrentUserSchema } from "./schema.js";

import db from "../../../db/index.js";
import { toAPIUser } from "../transfer.js";

export async function getCurrentUserHandler(request: FastifyRequest, reply: FastifyReply) {
	const { user } = request;

	if (!user) {
		return;
	}

	reply.status(200).send(toAPIUser(user));
}

export async function modifyCurrentUserHandler(request: FastifyRequest, reply: FastifyReply) {
	const { user } = request;

	if (!user) {
		return;
	}

	const payload = await modifyCurrentUserSchema.safeParseAsync(request.body);

	if (!payload.success) {
		reply.status(400).send({
			error: payload.error.issues,
		});

		return;
	}

	const { email } = payload.data;

	const [newUser] = await db
		.update(usersTable)
		.set({ email })
		.where(eq(usersTable.id, user.id))
		.returning();

	reply.status(200).send(toAPIUser(newUser));
}
