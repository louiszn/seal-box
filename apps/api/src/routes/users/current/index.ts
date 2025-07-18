import { FastifyInstance } from "fastify";
import { getCurrentUser } from "./controller.js";
import { authHandler } from "../../../middlewares/auth.js";

export default function currentUserRoute(app: FastifyInstance) {
	app.addHook("onRequest", authHandler);

	app.get("/", getCurrentUser);
}
