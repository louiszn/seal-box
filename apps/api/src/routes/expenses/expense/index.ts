import { APIExpenseRoute } from "@seal-box/enums";
import { FastifyInstance } from "fastify";
import { deleteExpenseHandler, getExpenseHandler, modifyExpenseHandler } from "./controller.js";
import { requireExpenseExists } from "./middleware.js";

export default function expenseRoute(app: FastifyInstance) {
	app.addHook("onRequest", requireExpenseExists);

	app.get(APIExpenseRoute.Get, getExpenseHandler);
	app.patch(APIExpenseRoute.Modify, modifyExpenseHandler);
	app.delete(APIExpenseRoute.Delete, deleteExpenseHandler);
}
