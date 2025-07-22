import { FastifyInstance } from "fastify";
import { loginHandler, logoutHandler, refreshTokenHandler, registerHandler } from "./controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { APIAuthRoute } from "@seal-box/enums";

export default function authRoute(app: FastifyInstance) {
	app.post(APIAuthRoute.Register, registerHandler);
	app.post(APIAuthRoute.Login, loginHandler);
	app.post(APIAuthRoute.RefreshToken, refreshTokenHandler);
	app.post(APIAuthRoute.Logout, { preHandler: requireAuth }, logoutHandler);
}
