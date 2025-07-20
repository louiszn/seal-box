import { APIIncomeRoute } from "@seal-box/enums";
import { FastifyInstance } from "fastify";
import { deleteIncomeHandler, getIncomeHandler, modifyIncomeHandler } from "./controller.js";
import { requireIncomeExists } from "./middleware.js";

export function incomeRoute(app: FastifyInstance) {
	app.addHook("onRequest", requireIncomeExists);

	app.get(APIIncomeRoute.Get, getIncomeHandler);
	app.patch(APIIncomeRoute.Modify, modifyIncomeHandler);
	app.delete(APIIncomeRoute.Delete, deleteIncomeHandler);
}
