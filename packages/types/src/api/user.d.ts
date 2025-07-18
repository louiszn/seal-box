export interface APIUser {
	id: string;
	email: string;
	createdAt: number;
}

export type APIModifyCurrentUserBody = Partial<Omit<APIUser, "id" | "createdAt">>;
