import { FastifyInstance } from "fastify";
import Route from "./Route.js";

import usersRoute from "./users/index.js";
import authRoute from "./auth/index.js";

export function useRoutes(app: FastifyInstance) {
	app.decorateRequest("user", null);
	app.decorateRequest("device", null);

	app.register(usersRoute, { prefix: Route.Users });
	app.register(authRoute, { prefix: Route.Auth });
}
