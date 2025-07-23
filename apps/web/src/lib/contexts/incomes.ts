import REST from "$lib/REST.js";
import { APIRoute } from "@seal-box/enums";
import type { APIIncome } from "@seal-box/types";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

const INCOMES_CONTEXT = Symbol();

interface IncomesContext {
	incomes: Writable<APIIncome[]>;
	init: () => Promise<void>;
	ready: Writable<boolean>;
}

export function createIncomesContext() {
	const incomes = writable<APIIncome[]>([]);
	const ready = writable<boolean>(false);

	const init = async () => {
		ready.set(false);

		if (!REST.getAccessToken()) {
			ready.set(true);
			return;
		}

		const [data, error] = await REST.get<APIIncome[]>(APIRoute.GetIncomes);

		if (error) {
			ready.set(true);
			return;
		}

		incomes.set(data);
		ready.set(true);
	};

	const context: IncomesContext = {
		incomes,
		ready,
		init,
	};

	setContext(INCOMES_CONTEXT, context);

	return context;
}

export function getIncomesContext() {
	return getContext<IncomesContext>(INCOMES_CONTEXT);
}
