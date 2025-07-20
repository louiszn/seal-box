import { InferSelectModel } from "drizzle-orm";
import { incomesTable } from "../../db/schema/incomes.js";
import { APIIncome } from "@seal-box/types";

export function toAPIIncome(income: InferSelectModel<typeof incomesTable>): APIIncome {
	return {
		id: income.id,
		amount: income.amount,
		title: income.title,
		description: income.description,
		categoryId: income.categoryId,
		receivedAt: income.receivedAt.getTime(),
		createdAt: income.createdAt.getTime(),
	};
}
