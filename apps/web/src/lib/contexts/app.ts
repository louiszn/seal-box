import { getContext, setContext } from "svelte";
import { createUserContext } from "./user.js";
import { writable, type Writable } from "svelte/store";

const APP_CONTEXT = Symbol();

interface AppContext {
	init: () => Promise<void>;
	reinit: () => Promise<void>;
	ready: Writable<boolean>;
}

export function createAppContext() {
	const ready = writable(false);

	const userContext = createUserContext();

	const init = async () => {
		ready.set(false);

		await userContext.init();

		ready.set(true);
	};

	const reinit = async () => {
		ready.set(false);

		await userContext.init();

		ready.set(true);
	};

	const context: AppContext = {
		init,
		reinit,
		ready,
	};

	setContext(APP_CONTEXT, context);

	return context;
}

export function getAppContext() {
	return getContext<AppContext>(APP_CONTEXT);
}
