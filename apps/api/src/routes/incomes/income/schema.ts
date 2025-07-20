import { APIModifyIncomeBody } from "@seal-box/types";
import z from "zod";

export const modifyIncomeSchema: z.ZodType<APIModifyIncomeBody> = z.object({
	title: z.string().nonempty().optional(),
	description: z.string().optional(),
	amount: z.int().optional(),
	categoryId: z.string().optional(),
	receivedAt: z
		.int()
		.refine((value) => !isNaN(new Date(value).getTime()))
		.optional(),
});
