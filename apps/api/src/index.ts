import Fastify from "fastify";

import { logger } from "@seal-box/libs";

import config from "./config.js";

import { useRoutes } from "./routes/index.js";
import { testConnection } from "./db/index.js";
import { usePlugins } from "./plugins/index.js";

const fastify = Fastify();

usePlugins(fastify);
useRoutes(fastify);

try {
	await testConnection();
	logger.info("Connected to database");
} catch (error) {
	logger.error("Failed to connect to database:", error);
}

fastify.listen(
	{
		port: config.port,
		host: "0.0.0.0",
	},
	() => {
		logger.info(`Server is listening at ${config.port}`);
	},
);
