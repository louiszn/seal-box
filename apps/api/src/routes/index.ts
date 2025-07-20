import { FastifyInstance } from "fastify";
import { APIRoutePrefix } from "@seal-box/enums";

import usersRoute from "./users/index.js";
import authRoute from "./auth/index.js";
import categoriesRoute from "./categories/index.js";
import incomesRoute from "./incomes/index.js";
import expensesRoute from "./expenses/index.js";

export function useRoutes(app: FastifyInstance) {
	app.register(usersRoute, { prefix: APIRoutePrefix.Users });
	app.register(authRoute, { prefix: APIRoutePrefix.Auth });
	app.register(categoriesRoute, { prefix: APIRoutePrefix.Categories });
	app.register(incomesRoute, { prefix: APIRoutePrefix.Incomes });
	app.register(expensesRoute, { prefix: APIRoutePrefix.Expenses });
}
