import { FastifyInstance } from "fastify";
import { createCategoryHandler, getCategoriesHandler } from "./controller.js";
import { APICategoriesRoute } from "@seal-box/enums";
import { requireAuth } from "../../middlewares/auth.js";
import { categoryRoute } from "./category/index.js";

export default function categoriesRoute(app: FastifyInstance) {
	app.addHook("onRequest", requireAuth);

	app.get(APICategoriesRoute.Get, getCategoriesHandler);
	app.post(APICategoriesRoute.Create, createCategoryHandler);

	app.register(categoryRoute, { prefix: APICategoriesRoute.WithId });
}
