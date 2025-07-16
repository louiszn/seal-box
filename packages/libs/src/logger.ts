import { createLogger, transports, format } from "winston";
import chalk, { ChalkInstance } from "chalk";

const LEVEL_COLOR_MAP: Record<string, ChalkInstance> = {
	info: chalk.bgBlue.white,
	error: chalk.bgRed.white,
	warn: chalk.bgYellow.white,
};

function getLevelTag(level: string) {
	const color = LEVEL_COLOR_MAP[level] ?? chalk.white;
	return color(` ${level.toUpperCase()} `);
}

export const logger = createLogger({
	transports: [new transports.Console()],
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.errors({ stack: true }),
		format.printf(({ level, message, timestamp, stack }) => {
			return `${chalk.gray(timestamp)}  ${getLevelTag(level)}  ${stack ?? message}`;
		}),
	),
});
