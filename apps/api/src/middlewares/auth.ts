import { FastifyRequest, FastifyReply } from "fastify";

import db from "../db/index.js";
import { eq } from "drizzle-orm";

import { devicesTable } from "../db/schema/devices.js";
import { usersTable } from "../db/schema/users.js";

import { verifyAccessToken } from "@seal-box/libs";

import config from "../config.js";

export async function authHandler(request: FastifyRequest, reply: FastifyReply) {
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

	request.setDecorator("user", user);
	request.setDecorator("device", device);
}
