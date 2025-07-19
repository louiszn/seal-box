import { JWTPayload, SignJWT, jwtVerify } from "jose";
import ms from "ms";

const ALGORITHM = "HS256";

export const REFRESH_TOKEN_AGE = 2_592_000_000; // 30 days in ms
export const ACCESS_TOKEN_AGE = 900_000; // 15 minutes in ms

export type MappedToken<Payload> = Payload & { expiresAt?: Date; createdAt?: Date };

function getEncodedSecret(secret: string) {
	return new TextEncoder().encode(secret);
}

export function signToken(
	payload: JWTPayload,
	secret: string,
	createdAt: Date,
	duration: string | Date | number,
) {
	const encodedSecret = getEncodedSecret(secret);

	if (typeof duration === "number") {
		duration = ms(duration);
	}

	return new SignJWT(payload)
		.setProtectedHeader({ alg: ALGORITHM })
		.setIssuedAt(createdAt)
		.setExpirationTime(duration)
		.sign(encodedSecret);
}

export function signAccessToken(userId: string, deviceId: string, secret: string, createdAt: Date) {
	return signToken({ userId, deviceId }, secret, createdAt, ACCESS_TOKEN_AGE);
}

export function signRefreshToken(
	userId: string,
	deviceId: string,
	secret: string,
	createdAt: Date,
) {
	return signToken({ userId, deviceId }, secret, createdAt, REFRESH_TOKEN_AGE);
}

export async function verifyToken<Payload>(
	token: string,
	secret: string,
	ignoreExp = false,
): Promise<MappedToken<Payload> | null> {
	try {
		const encodedSecret = getEncodedSecret(secret);

		const rawData = await jwtVerify(token, encodedSecret, {
			clockTolerance: ignoreExp ? Infinity : undefined,
		});

		const { iat, exp, ...rest } = rawData.payload;

		const data = {
			...(rest as Payload),
		} as MappedToken<Payload>;

		if (exp) {
			data.expiresAt = new Date(exp * 1000);
		}

		if (iat) {
			data.createdAt = new Date(iat * 1000);
		}

		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export function verifyAccessToken(token: string, secret: string, ignoreExp = false) {
	return verifyToken<{ userId: string; deviceId: string }>(token, secret, ignoreExp);
}

export function verifyRefreshToken(token: string, secret: string, ignoreExp = false) {
	return verifyToken<{ userId: string; deviceId: string }>(token, secret, ignoreExp);
}
