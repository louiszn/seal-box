import z from "zod";

import { APILoginBody, APIRegisterBody } from "@seal-box/types";

export const registerSchema: z.ZodType<APIRegisterBody> = z.object({
	email: z.email(),
	password: z.string().nonempty(),
});

export const loginSchema: z.ZodType<APILoginBody> = z.object({
	email: z.email(),
	password: z.string(),
});
