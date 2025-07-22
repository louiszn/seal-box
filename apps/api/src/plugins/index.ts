import { FastifyInstance } from "fastify";

import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

import config from "../config.js";

export function usePlugins(app: FastifyInstance) {
	app.register(cors, {
		origin: config.corsOrigin,
		credentials: true,
	});

	app.register(cookie, {
		parseOptions: {
			path: "/",
			httpOnly: true,
			secure: config.cookie.secure,
			sameSite: "strict",
		},
		secret: config.cookie.secret,
	});
}
