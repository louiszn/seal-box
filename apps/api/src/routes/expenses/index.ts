import { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.js";
import { APIExpensesRoute } from "@seal-box/enums";
import { createExpenseHandler, getExpensesHandler } from "./controller.js";
import expenseRoute from "./expense/index.js";

export default function expensesRoute(app: FastifyInstance) {
	app.addHook("onRequest", requireAuth);

	app.get(APIExpensesRoute.Get, getExpensesHandler);
	app.post(APIExpensesRoute.Create, createExpenseHandler);
	app.register(expenseRoute, { prefix: APIExpensesRoute.WithId });
}
