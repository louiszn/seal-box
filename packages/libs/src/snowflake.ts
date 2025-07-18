import { Snowflake } from "@sapphire/snowflake";

export const MAX_SNOWFLAKE_LENGTH = 25;

const EPOCH = new Date("2025-07-16T00:00:00.000Z");

const snowflake = new Snowflake(EPOCH);

export function generateId(timestamp?: Date): string {
	return snowflake.generate({ timestamp }).toString();
}

export function toTimestamp(id: string): Date {
	const { timestamp } = snowflake.deconstruct(id);
	return new Date(Number(timestamp));
}
