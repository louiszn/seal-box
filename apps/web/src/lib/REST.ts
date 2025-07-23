import { APIRoute } from "@seal-box/enums";

import type { APIRefreshTokenResponse } from "@seal-box/types";
import type { ZodIssue } from "zod/v3";

type FindParam<T extends string> = T extends `:${infer P}` ? P : never;

type SplitBySlash<T extends string> = T extends `${infer First}/${infer Rest}`
	? First | SplitBySlash<Rest>
	: T;

type ExtractPathParams<T extends string> = FindParam<SplitBySlash<T>>;

type HasParams<T extends APIRoute> = ExtractPathParams<T> extends never ? false : true;

export type Params<T extends APIRoute> = {
	[K in ExtractPathParams<T>]: string;
};

export enum RequestMethod {
	Get = "GET",
	Delete = "DELETE",
	Patch = "PATCH",
	Post = "POST",
	Put = "PUT",
}

export interface ResponseError {
	code: number;
	error: string | ZodIssue[];
}

export type RESTRequestInit = Omit<RequestInit, "method" | "body">;

export default abstract class REST {
	public static baseUrl: string = import.meta.env.VITE_PUBLIC_API_URL;

	public static get<T>(endpoint: string, init?: RESTRequestInit) {
		return this.request<T>(RequestMethod.Get, endpoint, undefined, init);
	}

	public static post<T, P>(endpoint: string, payload: P, init?: RESTRequestInit) {
		return this.request<T, P>(RequestMethod.Post, endpoint, payload, init);
	}

	public static put<T, P>(endpoint: string, payload: P, init?: RESTRequestInit) {
		return this.request<T, P>(RequestMethod.Put, endpoint, payload, init);
	}

	public static patch<T, P>(endpoint: string, payload: P, init?: RESTRequestInit) {
		return this.request<T, P>(RequestMethod.Patch, endpoint, payload, init);
	}

	public static delete<T>(endpoint: string, init?: RESTRequestInit) {
		return this.request<T>(RequestMethod.Delete, endpoint, undefined, init);
	}

	public static async request<T, P = unknown>(
		method: RequestMethod,
		endpoint: string,
		payload?: P,
		init?: RESTRequestInit,
	): Promise<[T, null] | [null, ResponseError]> {
		const response = await this.makeRequest<T, P>(method, endpoint, payload, init);

		const [, error] = response;

		if (error && error.code === 401 && this.getAccessToken()) {
			const isRefreshed = await this.refreshToken();

			if (isRefreshed) {
				// We got the new access token, everything should be fine now
				return await this.makeRequest<T, P>(method, endpoint, payload, init);
			}
		}

		return response;
	}

	public static async makeRequest<T, P = unknown>(
		method: RequestMethod,
		endpoint: string,
		payload?: P,
		init?: RESTRequestInit,
	): Promise<[T, null] | [null, ResponseError]> {
		const headers = new Headers(init?.headers);

		headers.set("Content-Type", "application/json");

		const accessToken = this.getAccessToken();

		if (accessToken) {
			headers.set("Authorization", `Bearer ${accessToken}`);
		}

		try {
			const url = new URL(endpoint, this.baseUrl).toString();

			const response = await fetch(url, {
				...init,
				method,
				headers,
				body: JSON.stringify(payload),
			});

			const json = await this.getJSONResponse<P>(response);

			if (!response.ok) {
				return [null, json as ResponseError];
			}

			return [json as T, null];
		} catch (error) {
			return [
				null,
				{
					code: 0,
					error: error instanceof Error ? error.message : "Unknown error",
				},
			];
		}
	}

	private static async refreshToken(): Promise<boolean> {
		const [data, error] = await this.makeRequest<APIRefreshTokenResponse>(
			RequestMethod.Post,
			APIRoute.RefreshToken,
			{},
			{
				// Refresh token is included as cookie
				credentials: "include",
			},
		);

		if (error) {
			this.removeAccessToken();
			return false;
		}

		this.setAccessToken(data.accessToken);

		return true;
	}

	public static useRoute<T extends APIRoute>(
		endpoint: T,
		...args: HasParams<T> extends false ? [] : [params: Params<T>] // Make params optional if there are no params
	): string;
	public static useRoute<T extends APIRoute>(endpoint: T, params: Params<T>): string;
	public static useRoute<T extends APIRoute>(endpoint: T, params?: Params<T>): string {
		let result: string = endpoint;

		if (typeof params == "object") {
			for (const k in params) {
				result = result.replace(`:${k}`, params[k as keyof Params<T>]);
			}
		}

		return result;
	}

	public static getAccessToken() {
		return sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken") || null;
	}

	public static removeAccessToken() {
		sessionStorage.removeItem("accessToken");
		localStorage.removeItem("accessToken");
	}

	public static setAccessToken(token: string, remember = false) {
		return (remember ? localStorage : sessionStorage).setItem("accessToken", token);
	}

	private static async getJSONResponse<T>(response: Response): Promise<T | ResponseError | object> {
		const contentType = response.headers.get("content-type");

		if (response.status === 201 || response.status === 204) {
			return {};
		}

		if (contentType?.startsWith("application/json")) {
			const data = await response.json();

			if (!response.ok) {
				return {
					code: response.status,
					...data,
				};
			}

			return data;
		}

		return {
			code: response.status,
			error: response.statusText,
		};
	}
}
