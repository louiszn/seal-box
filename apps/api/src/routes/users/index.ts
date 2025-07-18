import { FastifyInstance } from "fastify";
import { getUserByIdHandler } from "./controller.js";
import currentUserRoute from "./current/index.js";

export default function usersRoute(app: FastifyInstance) {
	app.get("/:userId", getUserByIdHandler);

	app.register(currentUserRoute, { prefix: "/@me" });
}
