import { FastifyInstance } from "fastify";
import { getUserByIdHandler } from "./controller.js";

import currentUserRoute from "./current/index.js";

import { APIUserRoute } from "@seal-box/enums";

export default function usersRoute(app: FastifyInstance) {
	app.get(APIUserRoute.GetById, getUserByIdHandler);

	app.register(currentUserRoute, { prefix: APIUserRoute.Current });
}
