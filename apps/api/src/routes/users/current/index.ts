import { FastifyInstance } from "fastify";
import { getCurrentUserHandler, modifyCurrentUserHandler } from "./controller.js";
import { authHandler } from "../../../middlewares/auth.js";
import { APICurrentUserRoute } from "@seal-box/enums";

export default function currentUserRoute(app: FastifyInstance) {
	app.addHook("onRequest", authHandler);

	app.get(APICurrentUserRoute.Get, getCurrentUserHandler);
	app.patch(APICurrentUserRoute.Modify, modifyCurrentUserHandler);
}
