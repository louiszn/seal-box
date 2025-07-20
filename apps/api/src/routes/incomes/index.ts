import { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.js";
import { APIIncomesRoute } from "@seal-box/enums";
import { createIncomeHandler, getIncomesHandler } from "./controller.js";
import incomeRoute from "./income/index.js";

export default function incomesRoute(app: FastifyInstance) {
	app.addHook("onRequest", requireAuth);

	app.get(APIIncomesRoute.Get, getIncomesHandler);
	app.post(APIIncomesRoute.Create, createIncomeHandler);
	app.register(incomeRoute, { prefix: APIIncomesRoute.WithId });
}
