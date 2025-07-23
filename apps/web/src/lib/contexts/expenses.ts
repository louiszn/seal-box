import REST from "$lib/REST.js";
import { APIRoute } from "@seal-box/enums";
import type { APIExpense } from "@seal-box/types";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

const EXPENSES_CONTEXT = Symbol();

interface ExpensesContext {
	expenses: Writable<APIExpense[]>;
	init: () => Promise<void>;
	ready: Writable<boolean>;
}

export function createExpensesContext() {
	const expenses = writable<APIExpense[]>([]);
	const ready = writable<boolean>(false);

	const init = async () => {
		ready.set(false);

		if (!REST.getAccessToken()) {
			ready.set(true);
			return;
		}

		const [data, error] = await REST.get<APIExpense[]>(APIRoute.GetExpenses);

		if (error) {
			ready.set(true);
			return;
		}

		expenses.set(data);
		ready.set(true);
	};

	const context: ExpensesContext = {
		expenses,
		ready,
		init,
	};

	setContext(EXPENSES_CONTEXT, context);

	return context;
}

export function getExpensesContext() {
	return getContext<ExpensesContext>(EXPENSES_CONTEXT);
}
