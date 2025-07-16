import Fastify from "fastify";

import { loggerOptions } from "@sealbox/libs";

import config from "./config.js";

const fastify = Fastify({
	logger: loggerOptions,
});

fastify.listen({
	port: config.port,
	host: "0.0.0.0",
});
