import REST from "$lib/REST.js";
import { APIRoute } from "@seal-box/enums";
import type { APICategory } from "@seal-box/types";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

const CATEGORIES_CONTEXT = Symbol();

interface CategoriesContext {
	categories: Writable<APICategory[]>;
	init: () => Promise<void>;
	ready: Writable<boolean>;
}

export function createCategoriesContext() {
	const categories = writable<APICategory[]>([]);
	const ready = writable<boolean>(false);

	const init = async () => {
		ready.set(false);

		if (!REST.getAccessToken()) {
			ready.set(true);
			return;
		}

		const [data, error] = await REST.get<APICategory[]>(APIRoute.GetCategories);

		if (error) {
			ready.set(true);
			return;
		}

		categories.set(data);
		ready.set(true);
	};

	const context: CategoriesContext = {
		categories,
		ready,
		init,
	};

	setContext(CATEGORIES_CONTEXT, context);

	return context;
}

export function getCategoriesContext() {
	return getContext<CategoriesContext>(CATEGORIES_CONTEXT);
}
