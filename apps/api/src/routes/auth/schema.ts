import z from "zod";

export const registerSchema = z.object({
	email: z.email(),
	password: z.string().nonempty(),
});

export const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

export const refreshTokenSchema = z.object({
	refreshToken: z.string().nonempty(),
});
