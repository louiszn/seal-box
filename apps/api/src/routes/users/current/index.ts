import { FastifyInstance } from "fastify";
import { getCurrentUserHandler, modifyCurrentUserHandler } from "./controller.js";
import { authHandler } from "../../../middlewares/auth.js";

export default function currentUserRoute(app: FastifyInstance) {
	app.addHook("onRequest", authHandler);

	app.get("/", getCurrentUserHandler);
	app.patch("/", modifyCurrentUserHandler);
}
