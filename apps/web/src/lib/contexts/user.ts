import REST from "$lib/REST.js";
import { APIRoute } from "@seal-box/enums";
import type { APIUser } from "@seal-box/types";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

const USER_CONTEXT = Symbol();

interface UserContext {
	user: Writable<APIUser | null>;
	ready: Writable<boolean>;
	init: () => Promise<void>;
}

export function createUserContext() {
	const user = writable<APIUser | null>(null);
	const ready = writable<boolean>(false);

	const init = async () => {
		ready.set(false);

		if (!REST.getAccessToken()) {
			ready.set(true);
			return;
		}

		const [data, error] = await REST.get<APIUser>(APIRoute.GetCurrentUser);

		if (error) {
			ready.set(true);
			return;
		}

		user.set(data);
		ready.set(true);
	};

	const context: UserContext = {
		user,
		ready,
		init,
	};

	setContext(USER_CONTEXT, context);

	return context;
}

export function getUserContext() {
	return getContext<UserContext>(USER_CONTEXT);
}
