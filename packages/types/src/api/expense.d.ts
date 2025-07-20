export interface APIExpense {
	id: string;
	categoryId: string | null;
	title: string;
	description: string | null;
	amount: number;
	spentAt: number;
	createdAt: number;
}

export interface APICreateExpenseBody {
	title: string;
	description?: string;
	categoryId?: string;
	amount: number;
	spentAt: number;
}

export type APIModifyExpenseBody = Partial<APICreateExpenseBody>;
