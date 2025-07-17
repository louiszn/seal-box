import { FastifyInstance } from "fastify";
import { getUserByIdHandler } from "./controller.js";

export default function usersRoute(app: FastifyInstance) {
	app.get("/:id", getUserByIdHandler);
}
