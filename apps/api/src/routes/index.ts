import { FastifyInstance } from "fastify";
import { APIRoutePrefix } from "@seal-box/enums";

import usersRoute from "./users/index.js";
import authRoute from "./auth/index.js";
import categoriesRoute from "./categories/index.js";

export function useRoutes(app: FastifyInstance) {
	app.decorateRequest("user", null);
	app.decorateRequest("device", null);

	app.register(usersRoute, { prefix: APIRoutePrefix.Users });
	app.register(authRoute, { prefix: APIRoutePrefix.Auth });
	app.register(categoriesRoute, { prefix: APIRoutePrefix.Categories });
}
