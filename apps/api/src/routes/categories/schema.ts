import { APICreateCategoryBody } from "@seal-box/types";
import z from "zod";

import { CategoryType } from "@seal-box/enums";

export const createCategorySchema: z.ZodType<APICreateCategoryBody> = z.object({
	name: z.string().nonempty(),
	description: z.string().optional(),
	type: z.enum(CategoryType),
});
