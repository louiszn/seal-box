import { SignJWT, jwtVerify } from "jose";

const ALGORITHM = "HS256";

export type MappedToken<Payload> = Payload & { expiresAt?: Date; createdAt?: Date };

function getEncodedSecret(secret: string) {
	return new TextEncoder().encode(secret);
}

export function signAccessToken(userId: string, deviceId: string, secret: string, createdAt: Date) {
	const signer = new SignJWT({ userId, deviceId })
		.setProtectedHeader({ alg: ALGORITHM })
		.setIssuedAt(createdAt)
		.setExpirationTime("15m");

	const encodedSecret = getEncodedSecret(secret);

	return signer.sign(encodedSecret);
}

export function signRefreshToken(
	userId: string,
	deviceId: string,
	secret: string,
	createdAt: Date,
) {
	const signer = new SignJWT({ userId, deviceId })
		.setProtectedHeader({ alg: ALGORITHM })
		.setIssuedAt(createdAt)
		.setExpirationTime("30d");

	const encodedSecret = getEncodedSecret(secret);

	return signer.sign(encodedSecret);
}

export async function verifyToken<Payload>(
	token: string,
	secret: string,
): Promise<MappedToken<Payload> | null> {
	try {
		const encodedSecret = getEncodedSecret(secret);

		const rawData = await jwtVerify(token, encodedSecret);

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
	} catch {
		return null;
	}
}

export function verifyAccessToken(token: string, secret: string) {
	return verifyToken<{ userId: string; deviceId: string }>(token, secret);
}

export function verifyRefreshToken(token: string, secret: string) {
	return verifyToken<{ userId: string; deviceId: string }>(token, secret);
}
