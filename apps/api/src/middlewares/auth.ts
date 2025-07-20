import { FastifyRequest, FastifyReply } from "fastify";

import db from "../db/index.js";
import { eq } from "drizzle-orm";

import { devicesTable, usersTable } from "../db/schema/index.js";

import { verifyAccessToken } from "@seal-box/libs";

import config from "../config.js";

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
	const authorization = request.headers.authorization || "";

	const [schema, token] = authorization.split(" ");

	const sendUnauthorized = () => {
		reply.status(401).send({
			error: "Unauthorized",
		});
	};

	if (schema !== "Bearer" || !token) {
		sendUnauthorized();
		return;
	}

	const tokenPayload = await verifyAccessToken(token, config.jwtSecret);

	if (!tokenPayload) {
		sendUnauthorized();
		return;
	}

	const { deviceId, userId, createdAt } = tokenPayload;

	const [device] = await db.select().from(devicesTable).where(eq(devicesTable.id, deviceId));

	if (!device || device.userId !== userId || device.lastSeenAt.getTime() !== createdAt?.getTime()) {
		sendUnauthorized();
		return;
	}

	const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

	if (!user) {
		sendUnauthorized();
		return;
	}

	request.user = user;
	request.device = device;
}
