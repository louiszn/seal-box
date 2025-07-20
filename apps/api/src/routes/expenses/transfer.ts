import { InferSelectModel } from "drizzle-orm";
import { expensesTable } from "../../db/schema/expenses.js";
import { APIExpense } from "@seal-box/types";

export function toAPIExpense(expense: InferSelectModel<typeof expensesTable>): APIExpense {
	return {
		id: expense.id,
		amount: expense.amount,
		title: expense.title,
		description: expense.description,
		categoryId: expense.categoryId,
		spentAt: expense.spentAt.getTime(),
		createdAt: expense.createdAt.getTime(),
	};
}
