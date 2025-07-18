import { FastifyInstance } from "fastify";
import { getUserByIdHandler } from "./controller.js";

import currentUserRoute from "./current/index.js";

import { APIUsersRoute } from "@seal-box/enums";

export default function usersRoute(app: FastifyInstance) {
	app.get(APIUsersRoute.GetById, getUserByIdHandler);

	app.register(currentUserRoute, { prefix: APIUsersRoute.Current });
}
