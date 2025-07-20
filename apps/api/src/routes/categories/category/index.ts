import { APICategoryRoute } from "@seal-box/enums";
import { FastifyInstance } from "fastify";
import { deleteCategoryHandler, getCategoryHandler, modifyCategoryHandler } from "./controller.js";
import { requireCategoryExists } from "./middleware.js";

export function categoryRoute(app: FastifyInstance) {
	app.addHook("onRequest", requireCategoryExists);

	app.get(APICategoryRoute.Get, getCategoryHandler);
	app.patch(APICategoryRoute.Modify, modifyCategoryHandler);
	app.delete(APICategoryRoute.Delete, deleteCategoryHandler);
}
