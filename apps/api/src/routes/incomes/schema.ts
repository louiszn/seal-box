import { APICreateIncomeBody } from "@seal-box/types";
import z from "zod";

export const createIncomeSchema: z.ZodType<APICreateIncomeBody> = z.object({
	title: z.string().nonempty(),
	description: z.string().optional(),
	categoryId: z.string().optional(),
	receivedAt: z.int().refine((value) => !isNaN(new Date(value).getTime())),
	amount: z.int().nonnegative(),
});
