import { APIModifyExpenseBody } from "@seal-box/types";
import z from "zod";

export const modifyExpenseSchema: z.ZodType<APIModifyExpenseBody> = z.object({
	title: z.string().nonempty().optional(),
	description: z.string().optional(),
	amount: z.int().optional(),
	categoryId: z.string().optional(),
	spentAt: z
		.int()
		.refine((value) => !isNaN(new Date(value).getTime()))
		.optional(),
});
