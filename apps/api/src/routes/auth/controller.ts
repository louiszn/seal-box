import { FastifyReply, FastifyRequest } from "fastify";
import { eq, InferSelectModel } from "drizzle-orm";
import { UAParser } from "ua-parser-js";

import { loginSchema, registerSchema } from "./schema.js";

import db from "../../db/index.js";
import { devicesTable, usersTable } from "../../db/schema/index.js";

import {
	generateId,
	hashPassword,
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyPassword,
	verifyRefreshToken,
	REFRESH_TOKEN_AGE,
} from "@seal-box/libs";

import config from "../../config.js";

import { APILoginResponse, APIRefreshTokenResponse } from "@seal-box/types";

export async function registerHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	const parseResult = await registerSchema.safeParseAsync(request.body);

	if (!parseResult.success) {
		console.log(parseResult.error.message);

		reply.status(400).send({
			error: parseResult.error.issues,
		});

		return;
	}

	const { data } = parseResult;

	const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, data.email));

	if (existingUser) {
		reply.status(400).send({
			error: "This email is already used",
		});

		return;
	}

	const createdAt = new Date();

	const hashedPassword = await hashPassword(data.password, config.pepperKey);

	await db.insert(usersTable).values({
		id: generateId(createdAt),
		email: data.email,
		password: hashedPassword,
		createdAt,
	});

	reply.status(201).send();
}

export async function loginHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	const parseResult = await loginSchema.safeParseAsync(request.body);

	if (!parseResult.success) {
		reply.status(400).send({
			error: parseResult.error.issues,
		});

		return;
	}

	const { data } = parseResult;

	const [user] = await db.select().from(usersTable).where(eq(usersTable.email, data.email));

	if (!user || !(await verifyPassword(data.password, user.password, config.pepperKey))) {
		await reply.status(401).send({
			error: "Invalid email or password requested",
		});

		return;
	}

	const createdAt = new Date();
	createdAt.setMilliseconds(0); // Avoid delay between token and device timestamp since jwt uses seconds

	const userAgent = request.headers["user-agent"] || "";

	const uaResult = new UAParser(userAgent).getResult();

	const deviceName = [
		uaResult.device.model || uaResult.device.type,
		uaResult.browser.name,
		uaResult.os.name,
	]
		.filter(Boolean)
		.join(" ");

	const [device] = await db
		.insert(devicesTable)
		.values({
			id: generateId(createdAt),
			name: deviceName,
			userId: user.id,
			createdAt,
			lastSeenAt: createdAt,
		})
		.returning();

	const accessToken = await signAccessToken(user.id, device.id, config.jwtSecret, createdAt);
	const refreshToken = await signRefreshToken(user.id, device.id, config.jwtSecret, createdAt);

	reply.setCookie("refreshToken", refreshToken, {
		maxAge: Math.floor(REFRESH_TOKEN_AGE / 1000),
	});

	reply.status(200).send({
		accessToken,
	} satisfies APILoginResponse);
}

export async function refreshTokenHandler(
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	const authorization = request.headers.authorization || "";

	const [schema, accessToken] = authorization.split(" ");

	if (schema !== "Bearer" || !accessToken) {
		reply.status(401).send({
			error: "Unauthorized",
		});

		return;
	}

	const { refreshToken } = request.cookies;

	if (!refreshToken) {
		reply.status(401).send({
			error: "Missing refresh token",
		});

		return;
	}

	const accessTokenPayload = await verifyAccessToken(accessToken, config.jwtSecret, true);
	const refreshTokenPayload = await verifyRefreshToken(refreshToken, config.jwtSecret);

	if (
		!accessTokenPayload ||
		!refreshTokenPayload ||
		accessTokenPayload.userId !== refreshTokenPayload.userId ||
		accessTokenPayload.deviceId !== refreshTokenPayload.deviceId ||
		accessTokenPayload.createdAt?.getTime() !== refreshTokenPayload.createdAt?.getTime()
	) {
		reply.status(401).send({
			error: "Invalid token specified",
		});

		return;
	}

	const { deviceId, userId, createdAt } = refreshTokenPayload;

	const [device] = await db.select().from(devicesTable).where(eq(devicesTable.id, deviceId));

	if (!device || device.userId !== userId || device.lastSeenAt.getTime() !== createdAt?.getTime()) {
		reply.status(401).send({
			error: "Invalid token specified",
		});

		return;
	}

	const newCreatedAt = new Date();
	newCreatedAt.setMilliseconds(0); // Avoid delay between token and device timestamp since jwt uses seconds

	const newAccessToken = await signAccessToken(userId, deviceId, config.jwtSecret, newCreatedAt);
	const newRefreshToken = await signRefreshToken(userId, deviceId, config.jwtSecret, newCreatedAt);

	await db
		.update(devicesTable)
		.set({
			lastSeenAt: newCreatedAt,
		})
		.where(eq(devicesTable.id, deviceId));

	reply.setCookie("refreshToken", newRefreshToken, {
		maxAge: Math.floor(REFRESH_TOKEN_AGE / 1000),
	});

	reply.status(200).send({
		accessToken: newAccessToken,
	} satisfies APIRefreshTokenResponse);
}

export async function logoutHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
	const device = request.getDecorator<InferSelectModel<typeof devicesTable>>("device");

	reply.clearCookie("refreshToken");

	await db.delete(devicesTable).where(eq(devicesTable.id, device.id));

	reply.status(204).send();
}
