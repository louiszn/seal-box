export interface APIIncome {
	id: string;
	categoryId: string | null;
	title: string;
	description: string | null;
	amount: number;
	receivedAt: number;
	createdAt: number;
}

export interface APICreateIncomeBody {
	title: string;
	description?: string;
	categoryId?: string;
	amount: number;
	receivedAt: number;
}

export type APIModifyIncomeBody = Partial<APICreateIncomeBody>;
