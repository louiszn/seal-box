import { FastifyInstance } from "fastify";
import { loginHandler, logoutHandler, refreshTokenHandler, registerHandler } from "./controller.js";
import { requireAuth } from "../../middlewares/auth.js";

export default function authRoute(app: FastifyInstance) {
	app.post("/register", registerHandler);
	app.post("/login", loginHandler);
	app.post("/refresh", refreshTokenHandler);
	app.post("/logout", { preHandler: requireAuth }, logoutHandler);
}
