import { getContext, setContext } from "svelte";
import { createUserContext } from "./user.js";
import { derived, type Readable } from "svelte/store";
import { createIncomesContext } from "./incomes.js";
import { createExpensesContext } from "./expenses.js";
import { createCategoriesContext } from "./categories.js";

const APP_CONTEXT = Symbol();

interface AppContext {
	init: () => Promise<void>;
	ready: Readable<boolean>;
}

export function createAppContext() {
	const userContext = createUserContext();
	const incomesContext = createIncomesContext();
	const expensesContext = createExpensesContext();
	const categoriesContext = createCategoriesContext();

	const contexts = [userContext, incomesContext, expensesContext, categoriesContext];

	const ready = derived(
		contexts.map((ctx) => ctx.ready),
		(readyStates) => readyStates.every(($ready) => $ready),
	);

	const init = async () => {
		await Promise.all(contexts.map((ctx) => ctx.init()));
	};

	const context: AppContext = {
		init,
		ready,
	};

	setContext(APP_CONTEXT, context);

	return context;
}

export function getAppContext() {
	return getContext<AppContext>(APP_CONTEXT);
}
