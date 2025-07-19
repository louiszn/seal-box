import { CategoryType } from "@seal-box/enums";

export interface APICategory {
	id: string;
	name: string;
	description: string | null;
	type: CategoryType;
	createdAt: number;
}

export interface APICreateCategoryBody {
	name: string;
	description?: string;
	type: CategoryType;
}
