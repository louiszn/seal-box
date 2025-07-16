import pino, { LoggerOptions } from "pino";

export const loggerOptions: LoggerOptions = {
	transport: { target: "pino-pretty", options: { ignore: "pid" } },
	level: "info",
};

export const logger = pino(loggerOptions);
