import { FastifyReply, FastifyRequest } from "fastify";

export function getUserByIdHandler(request: FastifyRequest, reply: FastifyReply) {
	console.log(request);
	console.log(reply);
}
