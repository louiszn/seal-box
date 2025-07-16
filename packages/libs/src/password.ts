import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

const scryptAsync = promisify(scrypt);

export interface HashedPassword {
	salt: string;
	hash: string;
}

export async function hashPasswordRaw(
	password: string,
	pepper: string,
	salt: string,
): Promise<HashedPassword> {
	const derivedKey = (await scryptAsync(password + pepper, salt, KEY_LENGTH)) as Buffer;

	return {
		salt,
		hash: derivedKey.toString("hex"),
	};
}

export async function hashPassword(
	password: string,
	pepper: string,
	salt = randomBytes(SALT_LENGTH).toString("hex"),
) {
	const raw = await hashPasswordRaw(password, pepper, salt);

	return `${raw.salt}:${raw.hash}`;
}

export async function verifyPassword(password: string, pepper: string, stored: string) {
	const [salt, storedHashHex] = stored.split(":");

	if (!salt || !storedHashHex) {
		return false;
	}

	const { hash } = await hashPasswordRaw(password, pepper, salt);

	const calculatedHash = Buffer.from(hash, "hex");
	const storedHash = Buffer.from(storedHashHex, "hex");

	if (storedHash.length !== calculatedHash.length) {
		return false;
	}

	return timingSafeEqual(storedHash, calculatedHash);
}
