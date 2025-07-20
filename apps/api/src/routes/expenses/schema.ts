import { APICreateExpenseBody } from "@seal-box/types";
import z from "zod";

export const createExpenseSchema: z.ZodType<APICreateExpenseBody> = z.object({
	title: z.string().nonempty(),
	description: z.string().optional(),
	categoryId: z.string().optional(),
	spentAt: z.int().refine((value) => !isNaN(new Date(value).getTime())),
	amount: z.int().nonnegative(),
});
