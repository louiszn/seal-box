import { APIModifyCurrentUserBody } from "@seal-box/types";
import z from "zod";

export const modifyCurrentUserSchema: z.ZodType<APIModifyCurrentUserBody> = z.object({
	email: z.email().optional(),
});
