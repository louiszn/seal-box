import { FastifyInstance } from "fastify";
import { APIRoute } from "@seal-box/enums";

import usersRoute from "./users/index.js";
import authRoute from "./auth/index.js";

export function useRoutes(app: FastifyInstance) {
	app.decorateRequest("user", null);
	app.decorateRequest("device", null);

	app.register(usersRoute, { prefix: APIRoute.Users });
	app.register(authRoute, { prefix: APIRoute.Auth });
}
