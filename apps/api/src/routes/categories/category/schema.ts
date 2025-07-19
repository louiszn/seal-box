import { APIModifyCategoryBody } from "@seal-box/types";
import z from "zod";

export const modifyCategorySchema: z.ZodType<APIModifyCategoryBody> = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
});
